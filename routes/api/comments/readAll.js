const redisClient = require('../../../config/redisClient');
const {
	parseFilters,
	fetchTopLevelCommentsAndReplies,
	nestCommentsByParentId,
	generateNextPageToken,
	easyParse,
} = require('../../../utils/pagination');

(async () => {
	await redisClient.connect().catch(console.error);
})();

exports.handler = async (event) => {
	try {
		const queryParams = easyParse(event.queryStringParameters) || {};
		const { postId, view, limit, pageToken } = parseFilters(
			queryParams,
			'comments'
		);

		if (!postId) {
			return {
				statusCode: 400,
				body: JSON.stringify({ error: 'postId is required' }),
			};
		}

		const cacheKey = `comments:${postId}:${view}:${limit}:${JSON.stringify(
			pageToken
		)}`; // Create a unique cache key

		// Check Redis cache first
		// const cachedComments = await redisClient.get(cacheKey);

		// if (cachedComments) {
		// 	console.log('Cache hit for comments');
		// 	let { comments, nextPageToken } = easyParse(cachedComments);

		// 	return {
		// 		statusCode: 200,
		// 		body: JSON.stringify({ comments, nextPageToken }),
		// 	};
		// }

		// Cache miss: Fetch from MongoDB
		// const aggregatedComments = await buildCommentQueryAndSort(
		// 	postId,
		// 	view,
		// 	pageToken,
		// 	limit
		// );
		console.log('FETCHING COMMENTS');
		const topLevelCommentsAndReplies = await fetchTopLevelCommentsAndReplies(
			postId,
			view,
			pageToken,
			limit
		);

		console.log(topLevelCommentsAndReplies);

		// const { topLevelComments, replies } = aggregatedComments[0];

		const replyLimit = 5;

		const structuredComments = nestCommentsByParentId(
			topLevelCommentsAndReplies,
			replyLimit
		);

		// Will revist pagination after initial refactor
		// const nextPageToken = generateNextPageToken(
		// 	structuredComments,
		// 	limit,
		// 	view
		// );
		let nextPageToken = null; //placeholder for now
		// Cache the results with an expiration time
		// redisClient.set(
		// 	cacheKey,
		// 	JSON.stringify({ comments: structuredComments, nextPageToken }),
		// 	'EX',
		// 	60 * 5
		// ); // Cache for 5 minutes

		return {
			statusCode: 200,
			body: JSON.stringify({ comments: structuredComments, nextPageToken }),
		};
	} catch (error) {
		console.error(error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Something went wrong' }),
		};
	}
};
