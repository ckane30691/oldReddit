const authenticate = require('../../../utils/authenticate');
const redisClient = require('../../../config/redisClient');
const validatePostInput = require('../../../validation/post');
const easyParse = require('../../../utils/easyParse');
const { v4: uuidv4 } = require('uuid');
const Post = require('../../../models/Post');

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

	const token = easyParse(event).headers.authorization?.split(' ')[1];
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
		const { errors, isValid } = validatePostInput(body);
		if (!isValid) {
			return {
				statusCode: 400,
				headers,
				body: JSON.stringify(errors),
			};
		}
		const postId = uuidv4();
		const postSuffix = `${postId.slice(-6)}-${body.title.split(' ').join('-')}`;

		const newPost = new Post({
			postId,
			userId: user.userId,
			author: user.username,
			title: body.title,
			redirectLink: body.redirectLink,
			postSuffix,
			body: body.body,
			subReddit: body.subReddit.split(' ').join('_'),
			replyCount: 0,
		});

		const cacheKey = `posts:${newPost.subReddit}:*`; // Invalidate all related comment caches
		const keys = await redisClient.keys(cacheKey);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			await redisClient.del(key);
		}

		await newPost.save();

		return {
			statusCode: 200,
			headers,
			body: JSON.stringify(newPost),
		};
	} catch (error) {
		console.error(error);
		return {
			statusCode: 500,
			headers,
			body: JSON.stringify({ error: 'Something went wrong', details: error }),
		};
	}
};
