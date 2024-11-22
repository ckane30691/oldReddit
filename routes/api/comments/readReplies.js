const redisClient = require('../../../config/redisClient');
const {
	easyParse,
	fetchRepliesUsingParentPath,
	nestRepliesByParentId,
	generateNextPageToken,
} = require('../../../utils/pagination');
const adjustDepth = require('../../../utils/comments/adjustDepth');

(async () => {
	await redisClient.connect().catch(console.error);
})();

exports.handler = async (event) => {
	try {
		const queryParams = easyParse(event.queryStringParameters) || {};
		const {
			limit = 10,
			pageToken = null,
			parentPath,
			topLevelCommentId,
			depth,
		} = easyParse(queryParams);
		const { commentId } = easyParse(event.pathParameters);

		const cacheKey = `replies:${commentId}:${limit}:${JSON.stringify(
			pageToken
		)}`; // Create a unique cache key for replies

		// Check Redis cache first
		const cachedReplies = await redisClient.get(cacheKey);

		if (cachedReplies) {
			console.log('Cache hit for replies');
			let { replies, nextPageToken } = easyParse(cachedReplies);

			return {
				statusCode: 200,
				body: JSON.stringify({ replies, replyNextPageToken: nextPageToken }),
			};
		}

		// Cache miss: Fetch replies for the specified comment with pagination

		// Decrement depth but keep the correct string formatting
		const adjustedDepth = adjustDepth(depth);

		const replies = await fetchRepliesUsingParentPath(
			topLevelCommentId,
			commentId,
			parentPath,
			limit,
			adjustedDepth,
			pageToken
		);

		// const structuredReplies = nestRepliesByParentId(replies, commentId);

		const nextPageToken = generateNextPageToken(replies);

		// Cache the replies with an expiration time
		redisClient.set(
			cacheKey,
			JSON.stringify({
				replies,
				nextPageToken: nextPageToken,
			}),
			'EX',
			60 * 5
		); // Cache for 5 minutes

		return {
			statusCode: 200,
			body: JSON.stringify({
				replies,
				replyNextPageToken: nextPageToken,
			}),
		};
	} catch (error) {
		console.error(error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Something went wrong' }),
		};
	}
};
