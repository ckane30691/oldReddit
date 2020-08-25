const express = require('express');
const router = express.router();
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../../models/User');

router.post('/signup', async (req, res) => {
	// const { errors, isValid } = validateRegisterInput(req.body);
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
			const payload = new User({
				username: req.body.name,
				email: req.body.email,
				passwordDigest: hash,
			});
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
	// const { errors, isValid } = validateLoginInput(req.body);

	if (!isValid) {
		return res.status(400).json(errors);
	}

	const name = req.body.username;
	const password = req.body.password;
	const user = await Client.FindByUsername(name);
	if (!user) {
		errors.username = 'User not found';
		return res.status(404).json(errors);
	}

	let isMatch = await bcrypt.compare(password, user.PWD);
	if (isMatch) {
		const payload = JSON.parse(JSON.stringify(req.user));
		payload = {
			loggedIn: true,
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

router.get('/currentClient', async (req, res) => {
	let user = req.user;
	if (!req.body.client.loggedIn)
		return res.status(401).json({ message: 'you must be logged in' });
	let user = await Client.FindByUsername(req.body.client.username);
	if (user) {
		res.json({
			loggedIn: true,
			username: user.username,
			bio: user.bio,
			tagLine: user.tagLine,
			email: user.email,
			imageURL: user.imageURL,
			coverImageURL: user.coverImageURL,
			confirmedEmail: user.emailConfirmed,
		});
	} else {
		res.status(401).json({ message: 'unauthorized' });
	}
});
module.exports = router;
