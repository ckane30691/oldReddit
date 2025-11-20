const Post = require('../../../models/Post');

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

	const postId = event.pathParameters.id;

	try {
		let post = await Post.query('postId').eq(postId).limit(1).exec();
		post = post[0];

		if (post) {
			return {
				statusCode: 200,
				headers,
				body: JSON.stringify(post),
			};
		} else {
			return {
				statusCode: 404,
				headers,
				body: JSON.stringify({ error: 'No post found' }),
			};
		}
	} catch (error) {
		console.error(error);
		return {
			statusCode: 500,
			headers,
			body: JSON.stringify({ error: 'Something went wrong' }),
		};
	}
};
