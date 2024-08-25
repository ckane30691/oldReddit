const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('./private/secret');

const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = keys;

module.exports = (passport) => {
	passport.use(
		new JwtStrategy(options, (payload, done) => {
			User.findById(payload.id)
				.then((user) => {
					if (user) {
						// return the user to the frontend
						return done(null, user);
					}
					// return false since there is no user
					return done(null, false);
				})
				.catch((err) => console.log(err));
		})
	);
};