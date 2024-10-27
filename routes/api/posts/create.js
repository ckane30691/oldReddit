const authenticate = require('../../../utils/authenticate');
const redisClient = require('../../../config/redisClient');
const validatePostInput = require('../../../validation/post');
const { easyParse } = require('../../../utils/pagination');
const { v4: uuidv4 } = require('uuid');
const Post = require('../../../models/Post');

(async () => {
	await redisClient.connect().catch(console.error);
})();

exports.handler = async (event) => {
	const token = easyParse(event).headers.Authorization?.split(' ')[1];
	if (!token) {
		return {
			statusCode: 401,
			body: JSON.stringify({ message: 'No token provided' }),
		};
	}
	try {
		const user = await authenticate(token);
		if (!user) {
			return {
				statusCode: 401,
				body: JSON.stringify({ message: 'Invalid token' }),
			};
		}
		const body = easyParse(event.body);
		const { errors, isValid } = validatePostInput(body);
		if (!isValid) {
			return {
				statusCode: 400,
				body: JSON.stringify(errors),
			};
		}
		const postId = uuidv4();
		const postSuffix = `${postId.slice(-6)}-${body.title}`;

		const newPost = new Post({
			postId,
			userId: user.userId,
			title: body.title,
			redirectLink: body.redirectLink,
			postSuffix,
			body: body.body,
			subReddit: body.subReddit,
		});

		const cacheKey = `posts:${body.subReddit}:*`; // Invalidate all related comment caches
		const keys = await redisClient.keys(cacheKey);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			await redisClient.del(key);
		}

		await newPost.save();

		return {
			statusCode: 200,
			body: JSON.stringify(newPost),
		};
	} catch (error) {
		console.log(error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Something went wrong', details: error }),
		};
	}
};
