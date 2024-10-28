const authenticate = require('../../../utils/authenticate');
const validateCommentInput = require('../../../validation/comment');
const redisClient = require('../../../config/redisClient');
const { easyParse } = require('../../../utils/pagination');
const { v4: uuidv4 } = require('uuid');
const Comment = require('../../../models/Comment');

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
			console.log("Didn't find user");
			return {
				statusCode: 401,
				body: JSON.stringify({ message: 'Invalid token' }),
			};
		}

		const body = easyParse(event.body);

		const { errors, isValid } = validateCommentInput(body);

		if (!isValid) {
			return {
				statusCode: 400,
				body: JSON.stringify(errors),
			};
		}

		const comment = new Comment({
			commentId: uuidv4(),
			userId: user.userId,
			postId: body.postId,
			body: body.body,
		});

		if (body.parentCommentId) {
			comment.parentCommentId = body.parentCommentId;
			comment.parentPath = `${body.parentPath}${body.parentCommentId}/`;
		}
		await comment.save();

		const cacheKey = `comments:${body.postId}:*`; // Invalidate all related comment caches
		const keys = await redisClient.keys(cacheKey);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			await redisClient.del(key);
		}

		return {
			statusCode: 200,
			body: JSON.stringify(comment),
		};
	} catch (error) {
		console.log(error);
		return {
			statusCode: 400,
			body: JSON.stringify({ error: 'Something went wrong' }),
		};
	}
};
