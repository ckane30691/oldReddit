const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const validateLoginInput = require('../../../validation/login');
const keys = require('../../../config/keys');
const User = require('../../../models/User');

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

	const body = JSON.parse(event.body);
	const { errors, isValid } = validateLoginInput(body);

	if (!isValid) {
		return {
			statusCode: 400,
			headers,
			body: JSON.stringify(errors),
		};
	}

	const email = body.email;
	const password = body.password;
	let user = await User.query('email')
		.eq(email)
		.using('GSI_Email')
		.limit(1)
		.exec();

	user = user[0] || null;

	if (!user) {
		errors.email = 'User not found';
		return {
			statusCode: 404,
			headers,
			body: JSON.stringify(errors),
		};
	}

	const isMatch = await bcrypt.compare(password, user.passwordDigest);
	if (isMatch) {
		const payload = {
			id: user.userId,
			username: user.username,
			email: user.email,
		};

		const token = jsonwebtoken.sign(payload, keys.secretOrKey, {
			expiresIn: 3600,
		});

		return {
			statusCode: 200,
			body: JSON.stringify({
				success: true,
				headers,
				token: 'Bearer ' + token,
			}),
		};
	} else {
		errors.password = 'Incorrect password';
		return {
			statusCode: 400,
			headers,
			body: JSON.stringify(errors),
		};
	}
};
