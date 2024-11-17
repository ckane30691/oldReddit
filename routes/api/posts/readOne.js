const Post = require('../../../models/Post');

exports.handler = async (event) => {
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
