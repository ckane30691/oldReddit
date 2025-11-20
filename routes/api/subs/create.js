const authenticate = require('../../../utils/authenticate');
const validateSubRedditInput = require('../../../validation/subReddit');
const redisClient = require('../../../config/redisClient');
const easyParse = require('../../../utils/easyParse');
const normalizeHeaders = require('../../../utils/normalizeHeaders');
const { v4: uuidv4 } = require('uuid');
const SubReddit = require('../../../models/SubReddit');

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

	const eventHeaders = easyParse(event).headers;

	const normalized = normalizeHeaders(eventHeaders);

	const token = normalized.authorization?.split(' ')[1];

	if (!token) {
		return {
			statusCode: 401,
			headers,
			body: JSON.stringify({ message: 'No token provided' }),
		};
	}

	try {
		const user = await authenticate(token);

		if (!user) {
			return {
				statusCode: 401,
				headers,
				body: JSON.stringify({ message: 'Invalid token' }),
			};
		}

		const body = easyParse(event.body);

		const { errors, isValid } = validateSubRedditInput(body);

		if (!isValid) {
			return {
				statusCode: 400,
				headers,
				body: JSON.stringify({ message: errors }),
			};
		}

		const newSubReddit = new SubReddit({
			subRedditId: uuidv4(),
			moderatorId: user.userId,
			title: body.title,
			desc: body.desc,
			category: 'default', //will eventually revist this
		});

		await newSubReddit.save();

		const cacheKey = `subReddits:`; // Invalidate all related subreddit caches
		const keys = await redisClient.keys(cacheKey);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			await redisClient.del(key);
		}

		return {
			statusCode: 200,
			headers,
			body: JSON.stringify(newSubReddit),
		};
	} catch (error) {
		console.log(error);
		return {
			statusCode: 400,
			headers,
			body: JSON.stringify({ message: error }),
		};
	}
};
