const mongoose = require('mongoose');
const keys = require('../../../config/keys');
const redisClient = require('../../../config/redisClient');
const {
	parseFilters,
	buildCommentQueryAndSort,
	structureCommentsByParentPath,
	generateNextPageToken,
	easyParse,
} = require('../../../utils/pagination');
mongoose.connect(keys.mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

(async () => {
	await redisClient.connect().catch(console.error);
})();

exports.handler = async (event) => {
	try {
		const queryParams = event.queryStringParameters || {};
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
		const cachedComments = await redisClient.get(cacheKey);

		if (cachedComments) {
			console.log('Cache hit for comments');
			let { comments, nextPageToken } = easyParse(cachedComments);

			return {
				statusCode: 200,
				body: JSON.stringify({ comments, nextPageToken }),
			};
		}

		// Cache miss: Fetch from MongoDB
		const aggregatedComments = await buildCommentQueryAndSort(
			postId,
			view,
			pageToken,
			limit
		);
		const { topLevelComments, replies } = aggregatedComments[0];

		const replyLimit = 5;

		const structuredComments = structureCommentsByParentPath(
			topLevelComments,
			replies,
			replyLimit
		);

		const nextPageToken = generateNextPageToken(
			structuredComments,
			limit,
			view
		);

		// Cache the results with an expiration time
		redisClient.set(
			cacheKey,
			JSON.stringify({ comments: structuredComments, nextPageToken }),
			'EX',
			60 * 5
		); // Cache for 5 minutes

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
