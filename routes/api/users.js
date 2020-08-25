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
			const hash = await bcrypt.hash(clientBody.password, salt);
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

module.exports = router;
