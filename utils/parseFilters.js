const formatPageTokenForPosts = (query) => {
	const pageToken = {};
	let createdAt = query['pageToken[createdAt]'];
	let rankingScore = query['pageToken[rankingScore]'];
	let netUpvotes = query['pageToken[netUpvotes]'];
	let postId = query['pageToken[postId]'];
	let subReddit = query['pageToken[subReddit]'];
	if (subReddit) pageToken.subReddit = subReddit;
	if (rankingScore) pageToken.rankingScore = Number(rankingScore);
	if (createdAt) pageToken.createdAt = Number(createdAt);
	if (netUpvotes) pageToken.netUpvotes = Number(netUpvotes);
	if (postId) pageToken.postId = postId;
	return Object.keys(pageToken).length ? pageToken : null;
};

const formatPageTokenForComments = (query) => {
	const pageToken = {};
	let parentPath_createdAt = query['pageToken[parentPath_createdAt]'];

	let parentPath_rankingScore_createdAt =
		query['pageToken[parentPath_rankingScore_createdAt]'];

	let parentPath_netUpvotes_createdAt =
		query['pageToken[parentPath_netUpvotes_createdAt]'];

	let postId = query['pageToken[postId]'];

	let commentId = query['pageToken[commentId]'];

	if (parentPath_rankingScore_createdAt)
		pageToken.parentPath_rankingScore_createdAt =
			parentPath_rankingScore_createdAt;

	if (parentPath_createdAt)
		pageToken.parentPath_createdAt = parentPath_createdAt;

	if (parentPath_netUpvotes_createdAt)
		pageToken.parentPath_netUpvotes_createdAt = parentPath_netUpvotes_createdAt;

	if (postId) pageToken.postId = postId;

	if (commentId) pageToken.commentId = commentId;

	return Object.keys(pageToken).length ? pageToken : null;
};

// Helper function to parse query filters
const parseFilters = (query, entityName) => {
	if (entityName === 'comments') {
		// const { postId, view, limit, pageToken } = query.filters;
		// return { postId, view, limit, pageToken };
		const postId = query['filters[postId]'];
		const view = query['filters[view]'] || 'Hot';
		const limit = query['limit'] || 25;
		const pageToken = formatPageTokenForComments(query);
		return { postId, view, limit, pageToken };
	} else {
		// posts
		// const { subReddit, view, limit, pageToken } = easyParse(query.filters);
		// return { subReddit, view, limit, pageToken };
		const subReddit = query['filters[subReddit]'];
		const view = query['filters[view]'] || 'Hot';
		const limit = query['limit'] || 10;
		const pageToken = formatPageTokenForPosts(query);
		return { subReddit, view, limit, pageToken };
	}
};

module.exports = parseFilters;
