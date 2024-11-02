const redisClient = require('../../../config/redisClient');
const {
	parseFilters,
	generateNextPageToken,
	easyParse,
	buildPostsQuery,
} = require('../../../utils/pagination');

(async () => {
	await redisClient.connect().catch(console.error);
})();

exports.handler = async (event) => {
	try {
		// Parse query parameters from Lambda event
		const queryParams = easyParse(event.queryStringParameters) || {};
		console.log(queryParams);
		const { subReddit, view, limit, pageToken } = parseFilters(
			queryParams,
			'posts'
		);

		if (!subReddit) {
			return {
				statusCode: 400,
				body: JSON.stringify({ error: 'subReddit is required' }),
			};
		}

		const cacheKey = `posts:${subReddit}:${view}:${limit}:${JSON.stringify(
			pageToken
		)}`;
		const cachedPosts = await redisClient.get(cacheKey);

		if (cachedPosts) {
			console.log('Cache hit for posts');
			let { posts, nextPageToken } = easyParse(cachedPosts);
			return {
				statusCode: 200,
				body: JSON.stringify({ posts, nextPageToken }),
			};
		}

		// Cache miss: Fetch posts from database (MongoDB, DynamoDB, etc.)
		let postsQuery = await buildPostsQuery(subReddit, view, pageToken);
		postsQuery = postsQuery.limit(Number(limit));
		const posts = await postsQuery.exec();
		let nextPageToken = generateNextPageToken(posts);

		// Cache result in Redis for 5 minutes
		await redisClient.set(
			cacheKey,
			JSON.stringify({ posts, nextPageToken }),
			'EX',
			60 * 5 // Cache expiration (5 minutes)
		);

		return {
			statusCode: 200,
			body: JSON.stringify({ posts, nextPageToken }),
		};
	} catch (error) {
		console.error(error);
		return {
			statusCode: 400,
			body: JSON.stringify({ error: 'Something went wrong', details: error }),
		};
	}
};
