const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const validateRegisterInput = require('../../../validation/signup');
const { v4: uuidv4 } = require('uuid');
const keys = require('../../../config/keys');
const User = require('../../../models/User');

exports.handler = async (event) => {
	const body = JSON.parse(event.body);
	const { errors, isValid } = validateRegisterInput(body);

	if (!isValid) {
		return {
			statusCode: 400,
			body: JSON.stringify(errors),
		};
	}

	let user = await User.query('email').eq(body.email).using('GSI_Email').exec();

	if (user.count > 0) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				email: 'A user has already registered with this address',
			}),
		};
	}

	try {
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(body.password, salt);
		const payload = {
			userId: uuidv4(),
			username: body.username,
			email: body.email,
			passwordDigest: hash,
		};

		let userInstance = new User(payload);
		await userInstance.save();

		// Remove passwordDigest from payload
		payload.id = userInstance.userId;
		delete payload.passwordDigest;

		// Sign JWT token
		const token = jsonwebtoken.sign(payload, keys.secretOrKey, {
			expiresIn: 3600,
		});

		return {
			statusCode: 200,
			body: JSON.stringify({
				success: true,
				token: 'Bearer ' + token,
			}),
		};
	} catch (error) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error }),
		};
	}
};
