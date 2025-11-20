const redisClient = require('../../../config/redisClient');
const parseFilters = require('../../../utils/parseFilters');
const {
	fetchTopLevelCommentsAndReplies,
	nestCommentsByParentId,
} = require('../../../utils/comments/fetchHelpers');
const easyParse = require('../../../utils/easyParse');
const generateNextPageToken = require('../../../utils/generateNextPageToken');

(async () => {
	await redisClient.connect().catch(console.error);
})();

const headers = {
	'Access-Control-Allow-Origin': 'https://wrote-it.netlify.app',
	'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
	'Access-Control-Allow-Headers': 'Content-Type,Authorization',
	'Access-Control-Allow-Credentials': true,
};

exports.handler = async (event) => {
	if (event.httpMethod === 'OPTIONS') {
		return {
			statusCode: 200,
			headers,
			body: JSON.stringify({}),
		};
	}

	try {
		const queryParams = easyParse(event.queryStringParameters) || {};
		const { postId, view, limit, pageToken } = parseFilters(
			queryParams,
			'comments'
		);

		if (!postId) {
			return {
				statusCode: 400,
				headers,
				body: JSON.stringify({ error: 'postId is required' }),
			};
		}

		const cacheKey = `comments:${postId}:${view}:${limit}:${JSON.stringify(
			pageToken
		)}`; // Create a unique cache key

		// Check Redis cache first
		const cachedComments = await redisClient.get(cacheKey);

		if (cachedComments) {
			console.log('Cache hit for comments');
			let { comments, nextPageToken } = easyParse(cachedComments);

			return {
				statusCode: 200,
				headers,
				body: JSON.stringify({ comments, nextPageToken }),
			};
		}

		// Cache miss: Fetch from DynamoDB
		const topLevelCommentsAndReplies = await fetchTopLevelCommentsAndReplies(
			postId,
			view,
			pageToken,
			limit
		);

		console.log(topLevelCommentsAndReplies);

		const structuredComments = nestCommentsByParentId(
			topLevelCommentsAndReplies
		);

		const nextPageToken = generateNextPageToken(topLevelCommentsAndReplies);

		// Cache the results with an expiration time
		redisClient.set(
			cacheKey,
			JSON.stringify({ comments: structuredComments, nextPageToken }),
			'EX',
			60 * 5
		); // Cache for 5 minutes

		return {
			statusCode: 200,
			headers,
			body: JSON.stringify({ comments: structuredComments, nextPageToken }),
		};
	} catch (error) {
		console.error(error);
		return {
			statusCode: 500,
			headers,
			body: JSON.stringify({ error: 'Something went wrong' }),
		};
	}
};
