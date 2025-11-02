const redisClient = require('../../../config/redisClient');
const SubReddit = require('../../../models/SubReddit');
const easyParse = require('../../../utils/easyParse');

(async () => {
	await redisClient.connect().catch(console.error);
})();

exports.handler = async (event) => {
	if (event.httpMethod === 'OPTIONS') {
		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': 'https://wrote-it.netlify.app',
				'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
				'Access-Control-Allow-Headers': 'Content-Type,Authorization',
				'Access-Control-Allow-Credentials': true,
			},
			body: JSON.stringify({}),
		};
	}

	try {
		// const queryParams = event.queryStringParameters;
		// const userId = queryParams?.filters;

		// let subReddits = !userId
		// 	? await SubReddit.find()
		// 	: await SubReddit.find({ userId });

		const cacheKey = `subReddits:`; // Create a unique cache key

		// Check Redis cache first
		const cachedSubReddits = await redisClient.get(cacheKey);

		if (cachedSubReddits) {
			console.log('Cache hit for subReddits');
			const { subReddits } = easyParse(cachedSubReddits);

			return {
				statusCode: 200,
				body: JSON.stringify(subReddits),
			};
		}

		const subReddits = await SubReddit.query('category').eq('default').exec();

		//Cache the results with an expiration time
		await redisClient.set(
			cacheKey,
			JSON.stringify({ subReddits }),
			'EX',
			60 * 60
		); // Cache for 1 hour
		return {
			statusCode: 200,
			body: JSON.stringify(subReddits),
		};
	} catch (err) {
		console.log(err);
		return {
			statusCode: 404,
			body: JSON.stringify({ noSubRedditsFound: 'No subReddits found' }),
		};
	}
};
