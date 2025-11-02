const Post = require('../../../models/Post');

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

	const postId = event.pathParameters.id;

	try {
		let post = await Post.query('postId').eq(postId).limit(1).exec();
		post = post[0];
		console.log(post);
		if (post) {
			return {
				statusCode: 200,
				body: JSON.stringify(post),
			};
		} else {
			return {
				statusCode: 404,
				body: JSON.stringify({ error: 'No post found' }),
			};
		}
	} catch (error) {
		console.log(error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Something went wrong' }),
		};
	}
};
