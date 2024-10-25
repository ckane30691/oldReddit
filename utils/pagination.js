const Comment = require('../models/Comment');
const Post = require('../models/Post');
const mongoose = require('mongoose');
// Pagination Helpers
const easyParse = (item) => {
	return typeof item === 'string' ? JSON.parse(item) : item;
};

const formatPageToken = (query) => {
	const pageToken = {};
	let createdAt = query['pageToken[createdAt]'];
	let rankingScore = query['pageToken[rankingScore]'];
	let netUpvotes = query['pageToken[netUpvotes]'];
	if (createdAt) pageToken.createdAt = createdAt;
	if (rankingScore) pageToken.rankingScore = rankingScore;
	if (netUpvotes) pageToken.netUpvotes = netUpvotes;
	return Object.keys(pageToken).length ? pageToken : null;
};

// Helper function to parse query filters
const parseFilters = (query, entityName) => {
	if (entityName === 'comments') {
		const postId = query['filters[postId]'];
		const view = query['filters[view]'] || 'Hot';
		const limit = query['limit'] || 10;
		const pageToken = formatPageToken(query);
		return { postId, view, limit, pageToken };
	} else {
		// posts
		const subRedditId = query['filters[subRedditId]'];
		const view = query['filters[view]'] || 'Hot';
		const limit = query['limit'] || 10;
		const pageToken = formatPageToken(query);
		return { subRedditId, view, limit, pageToken };
	}
};

// Naive Approach N+1 Query
// const fetchRepliesRecursive = async (parentCommentId, limit, pageToken) => {
// 	let query = { parentCommentId };
// 	let sortOption = { rankingScore: -1, createdAt: -1 }; // Replies sorted by ranking and creation time

// 	// Handle pagination for replies
// 	if (pageToken) {
// 		const { rankingScore, createdAt } = easyParse(pageToken);

// 		query.$or = [
// 			{ rankingScore: { $lt: rankingScore } },
// 			{ rankingScore: rankingScore, createdAt: { $lt: new Date(createdAt) } }
// 		]

// 	}

// 	const replies = await Comment.find(query).sort(sortOption).limit(parseInt(limit)).lean();

// 	// Fetch replies for each reply recursively
// 	for (const reply of replies) {
// 		const { replies: childReplies, nextPageToken: childReplyPageToken } = await fetchRepliesRecursive(reply._id, limit, null);
// 		reply.replies = childReplies; // Attach child replies
// 		reply.replyNextPageToken = childReplyPageToken; // Attach pagination token for replies of replies
// 	}

// 	const nextPageToken = generateNextPageToken(replies, limit, 'Replies');

// 	return { replies, nextPageToken };
// };

// Optimized Approach using Precomputed Path
const fetchRepliesUsingParentPath = async (
	parentCommentId,
	parentPath,
	limit,
	pageToken
) => {
	// Build the query using the parentPath
	let query = {
		parentPath: { $regex: `^${parentPath}${parentCommentId}/` },
	};

	// Handle pagination for replies using pageToken
	let sortOption = { rankingScore: -1, createdAt: -1 }; // Sort replies by ranking and creation time
	if (pageToken) {
		const { rankingScore, createdAt } = easyParse(pageToken);

		query.$or = [
			{ rankingScore: { $lt: parseInt(rankingScore) } },
			{
				rankingScore: parseInt(rankingScore),
				createdAt: { $lt: new Date(createdAt) },
			},
		];
	}

	// Fetch all replies that match the parent path, sorted and limited
	const replies = await Comment.find(query)
		.sort(sortOption)
		.limit(parseInt(limit))
		.lean();

	const structuredReplies = structureReplies(replies, limit, parentCommentId);

	// Generate pagination token for the next set of replies
	const nextPageToken = generateNextPageToken(
		structuredReplies,
		limit,
		'Replies'
	);

	return { replies: structuredReplies, nextPageToken };
};

const structureReplies = (replies, limit, topLevelId) => {
	// Create a map where each comment ID will be the key and the value is the comment object
	const replyMap = {};
	const rootReplies = [];

	// First, initialize each reply in the map
	for (const reply of replies) {
		reply.replies = []; // Initialize the replies array
		reply.replyNextPageToken = null; // Initialize the nextPageToken for child replies
		replyMap[reply._id] = reply;
	}

	// Now organize replies into a hierarchy based on parentCommentId
	for (const reply of replies) {
		if (String(reply.parentCommentId) !== String(topLevelId)) {
			// If the comment has a parent, add it to its parent's replies array
			const parentComment = replyMap[reply.parentCommentId];
			if (parentComment) {
				parentComment.replies.push(reply);
			}
		} else {
			// If no parent, it's a top-level comment, add it to the root
			rootReplies.push(reply);
		}
	}

	// Generate next page token for each parent comment if the replies exceed the limit
	for (const reply of Object.values(replyMap)) {
		if (reply.replies.length > limit) {
			// Trim replies to fit within the limit
			reply.replies = reply.replies.slice(0, limit);
			reply.replyNextPageToken = generateNextPageToken(
				reply.replies,
				limit,
				'Replies'
			);
		}
	}

	return rootReplies;
};

// Optimized by fetching nested comments via precomputed path
const buildCommentQueryAndSort = async (postId, view, pageToken, limit) => {
	let paginationQuery = {};
	let sortOption;

	if (view === 'Hot') {
		sortOption = { rankingScore: -1, createdAt: -1 };
		if (pageToken) {
			const { rankingScore, createdAt } = easyParse(pageToken);

			paginationQuery.$or = [
				{ rankingScore: { $lt: parseInt(rankingScore) } },
				{
					rankingScore: parseInt(rankingScore),
					createdAt: { $lt: new Date(createdAt) },
				},
			];
		}
	} else if (view === 'New') {
		sortOption = { createdAt: -1 };
		if (pageToken) {
			const { createdAt } = easyParse(pageToken);

			paginationQuery.createdAt = { $lt: new Date(createdAt) };
		}
	} else if (view === 'Top') {
		sortOption = { netUpvotes: -1, createdAt: -1 };
		if (pageToken) {
			const { netUpvotes, createdAt } = easyParse(pageToken);

			paginationQuery.$or = [
				{ netUpvotes: { $lt: parseInt(netUpvotes) } },
				{
					netUpvotes: parseInt(netUpvotes),
					createdAt: { $lt: new Date(createdAt) },
				},
			];
		}
	}

	// MongoDB aggregation with $facet to handle both top-level comments and replies
	return Comment.aggregate([
		{
			$facet: {
				// Top-level comments (parentPath: '/')
				topLevelComments: [
					{
						$match: {
							postId: new mongoose.Types.ObjectId(postId),
							parentPath: '/',
							...paginationQuery,
						},
					},
					{ $sort: sortOption },
					{ $limit: parseInt(limit) }, // Limit for top-level comments
				],
				// Replies (one or two levels deep)
				replies: [
					{
						$match: {
							postId: new mongoose.Types.ObjectId(postId),
							parentPath: { $regex: '^/[^/]+/' }, // Regex for nested replies
						},
					},
					{ $sort: sortOption }, // Apply same sorting to replies
					{ $limit: parseInt(limit * 2) }, // Arbitrary high limit for replies
				],
			},
		},
	]).exec();
};

const structureCommentsByParentPath = (topLevelComments, replies, limit) => {
	const commentMap = {};
	const structuredComments = [];

	// Create a map of comment _id to comment object
	topLevelComments.forEach((comment) => {
		commentMap[comment._id] = comment;
		comment.replies = [];
		comment.replyNextPageToken = null;
		structuredComments.push(comment);
	});

	replies.forEach((reply) => {
		commentMap[reply._id] = reply;
		reply.replies = [];
		reply.replyNextPageToken = null;
	});

	replies.forEach((reply) => {
		const parentId = reply.parentCommentId;
		if (parentId && commentMap[parentId]) {
			commentMap[parentId].replies.push(reply);
		}
	});

	// Generate next page token for each parent comment if the replies exceed the limit
	for (const comment of Object.values(commentMap)) {
		if (comment.replies.length > limit) {
			// Trim replies to fit within the limit
			comment.replies = comment.replies.slice(0, limit);
			comment.replyNextPageToken = generateNextPageToken(
				comment.replies,
				limit,
				'Replies'
			);
		}
	}

	return structuredComments;
};

const buildPostsQuery = (postIds, view, pageToken) => {
	let postsQuery = Post.find({ _id: { $in: postIds } });

	// Apply sorting based on the view
	if (view === 'New') {
		postsQuery = postsQuery.sort({ createdAt: -1 });
		if (pageToken) {
			const { createdAt } = easyParse(pageToken);
			postsQuery = postsQuery.where('createdAt').lt(new Date(createdAt));
		}
	} else if (view === 'Top') {
		postsQuery = postsQuery.sort({ netUpvotes: -1, createdAt: -1 });
		if (pageToken) {
			const { netUpvotes, createdAt } = easyParse(pageToken);
			postsQuery = postsQuery.or([
				{ netUpvotes: { $lt: netUpvotes } },
				{ netUpvotes, createdAt: { $lt: new Date(createdAt) } },
			]);
		}
	} else {
		postsQuery = postsQuery.sort({ rankingScore: -1, createdAt: -1 });
		if (pageToken) {
			const { rankingScore, createdAt } = easyParse(pageToken);
			postsQuery = postsQuery.or([
				{ rankingScore: { $lt: rankingScore } },
				{ rankingScore, createdAt: { $lt: new Date(createdAt) } },
			]);
		}
	}

	return postsQuery;
};

// Helper function to generate the nextPageToken for pagination
const generateNextPageToken = (items, limit, view) => {
	if (items.length < limit) return null;

	const lastItem = items[items.length - 1];
	const tokenData = { createdAt: lastItem.createdAt };

	if (view === 'Top') {
		tokenData.netUpvotes = lastItem.netUpvotes;
	} else if (view === 'Replies' || view === 'Hot') {
		tokenData.rankingScore = lastItem.rankingScore;
	}

	return JSON.stringify(tokenData);
};

module.exports = {
	easyParse,
	parseFilters,
	fetchRepliesUsingParentPath,
	structureCommentsByParentPath,
	buildCommentQueryAndSort,
	buildPostsQuery,
	generateNextPageToken,
};
