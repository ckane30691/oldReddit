const express = require('express');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../../models/User');
const passport = require('passport');
const validateRegisterInput = require('../../validation/signup');
const validateLoginInput = require('../../validation/login');
const keys = require('../../config/keys');

const router = express.Router();
router.post('/signup', async (req, res) => {
	const { errors, isValid } = validateRegisterInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}

	let user = await User.findOne({ email: req.body.email });
	if (user) {
		return res
			.status(400)
			.json({ email: 'A user has already registered with this address' });
	} else {
		try {
			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(req.body.password, salt);
			const payload = {
				username: req.body.username,
				email: req.body.email,
				passwordDigest: hash,
			};
			let userInstance = new User(payload);
			userInstance.save();

			delete payload.passwordDigest;

			jsonwebtoken.sign(
				payload,
				keys.secretOrKey,
				{ expiresIn: 3600 },
				(err, token) => {
					res.json({
						success: true,
						token: 'Bearer ' + token,
					});
				}
			);
		} catch (err) {
			res.status(400).json({ error: err });
		}
	}
});

router.post('/login', async (req, res) => {
	const { errors, isValid } = validateLoginInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}

	const email = req.body.email;
	const password = req.body.password;
	const user = await User.findOne({ email });

	if (!user) {
		errors.username = 'User not found';
		return res.status(404).json(errors);
	}

	let isMatch = await bcrypt.compare(password, user.passwordDigest);
	if (isMatch) {
		const payload = {
			username: user.username,
			email: user.email,
		};
		jsonwebtoken.sign(
			payload,
			keys.secretOrKey,
			// Tell the key to expire in one hour
			{ expiresIn: 3600 },
			(err, token) => {
				res.json({
					success: true,
					token: 'Bearer ' + token,
				});
			}
		);
	} else {
		errors.password = 'Incorrect password';
		return res.status(400).json(errors);
	}
});

router.get(
	'/current',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		res.json({
			id: req.user.id,
			email: req.user.email,
			username: req.user.username,
		});
	}
);
module.exports = router;
