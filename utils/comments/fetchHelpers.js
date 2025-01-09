const Comment = require('../../models/Comment');

const fetchRepliesUsingParentPath = async (
	topLevelCommentId,
	commentId,
	parentPath,
	limit,
	depth,
	pageToken
) => {
	console.log('TOP LEVEL COMMENT ID: ', topLevelCommentId);
	console.log('LIMIT: ', limit);
	let commentQuery = Comment.query('parentCommentId')
		.eq(commentId)
		.using('GSI_Hot_Replies')
		.sort('descending')
		.limit(Number(limit));

	if (pageToken) {
		console.log('FOUND PAGE TOKEN: ', pageToken);
		const lastKey = easyParse(pageToken);
		commentQuery = commentQuery.startAt(lastKey);
	}
	return await commentQuery.exec();
};

const nestRepliesByParentId = (replies, parentCommentId) => {
	// Create a map where each comment ID will be the key and the value is the comment object
	const replyMap = {};
	const rootReplies = [];

	// First, initialize each reply in the map
	for (const reply of replies) {
		reply.replies = []; // Initialize the replies array
		reply.replyNextPageToken = null; // Initialize the nextPageToken for child replies
		replyMap[reply.commentId] = reply;
	}

	// Now organize replies into a hierarchy based on parentCommentId
	for (const reply of replies) {
		if (String(reply.parentCommentId) !== String(parentCommentId)) {
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

	return rootReplies;
};

const fetchTopLevelCommentsAndReplies = async (
	postId,
	view,
	pageToken,
	limit
) => {
	console.log(postId, view, pageToken, limit);
	let commentQuery = Comment.query('postId')
		.eq(`${postId}`)
		.limit(Number(limit));

	let gsi;
	if (view === 'New') {
		gsi = 'GSI_New';
		commentQuery = commentQuery.using(gsi).sort('descending');
	} else if (view === 'Top') {
		gsi = 'GSI_Top';
		commentQuery = commentQuery.using(gsi).sort('descending');
	} else {
		// Hot
		gsi = 'GSI_Hot';
		commentQuery = commentQuery.using(gsi).sort('descending');
	}
	if (pageToken) {
		const lastKey = easyParse(pageToken);
		commentQuery = commentQuery.startAt(lastKey);
	}
	return await commentQuery.exec();
};

const nestCommentsByParentId = (comments) => {
	const commentMap = {};
	const structuredComments = [];

	// Create a map of comment _id to comment object
	comments.forEach((comment) => {
		commentMap[comment.commentId] = comment;
		comment.replies = [];
		comment.replyNextPageToken = null;
		if (comment.parentCommentId == null) {
			structuredComments.push(comment);
		}
	});

	// replies.forEach((reply) => {
	// 	commentMap[reply._id] = reply;
	// 	reply.replies = [];
	// 	reply.replyNextPageToken = null;
	// });

	comments.forEach((comment) => {
		const parentId = comment.parentCommentId;
		if (parentId && commentMap[parentId]) {
			commentMap[parentId].replies.push(comment);
		}
	});

	// Generate next page token for each parent comment if the replies exceed the limit
	// NOTE: Will adjust pagination logic once done with initial refactor
	// for (const comment of Object.values(commentMap)) {
	// 	if (comment.replies.length > limit) {
	// 		// Trim replies to fit within the limit
	// 		comment.replies = comment.replies.slice(0, limit);
	// 		comment.replyNextPageToken = generateNextPageToken(
	// 			comment.replies,
	// 			limit,
	// 			'Replies'
	// 		);
	// 	}
	// }

	return structuredComments;
};

module.exports = {
	nestRepliesByParentId,
	fetchRepliesUsingParentPath,
	nestCommentsByParentId,
	fetchTopLevelCommentsAndReplies,
};
