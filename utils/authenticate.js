const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/User');
const keys = require('../config/keys');

const authenticate = async (token) => {
	if (!token) return false;
	try {
		const decoded = jsonwebtoken.verify(token, keys.secretOrKey);

		// For artillery test we'll get rid of this extra db call and just rely on the JWT verification
		// This reflects a broader strategy of moving toward omitting the db check but issuing shorter
		// lived JWTs + refresh tokens
		const user =
			(await User.get({ userId: decoded.id, email: decoded.email })) || null;

		if (!user) return false;
		return user;
	} catch (error) {
		console.log(error);
		return false;
	}
};

module.exports = authenticate;
