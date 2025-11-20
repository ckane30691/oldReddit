const authenticate = require('../../../utils/authenticate');

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

	const token = event.headers.authorization?.split(' ')[1];

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
				statusCode: 404,
				headers,
				body: JSON.stringify({ message: 'User not found' }),
			};
		}

		return {
			statusCode: 200,
			body: JSON.stringify({
				id: user.id,
				username: user.username,
				email: user.email,
			}),
		};
	} catch (error) {
		return {
			statusCode: 401,
			headers,
			body: JSON.stringify({ message: 'Invalid token' }),
		};
	}
};
