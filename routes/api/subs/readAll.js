const SubReddit = require('../../../models/SubReddit');

// TODO: Add caching to this function
exports.handler = async (event) => {
	try {
		// const queryParams = event.queryStringParameters;
		// const userId = queryParams?.filters;

		// let subReddits = !userId
		// 	? await SubReddit.find()
		// 	: await SubReddit.find({ userId });
		const subReddits = await SubReddit.scan().exec();
		return {
			statusCode: 200,
			body: JSON.stringify(subReddits),
		};
	} catch (err) {
		return {
			statusCode: 404,
			body: JSON.stringify({ noSubRedditsFound: 'No subReddits found' }),
		};
	}
};
