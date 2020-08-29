const express = require('express');
const SubReddit = require('../../models/SubReddit');
const passport = require('passport');
const validateSubRedditInput = require('../../validation/subReddit');

const router = express.Router();

module.exports = router;

router.get('/', async (req, res) => {
	try {
		let subReddits = await SubReddit.find(); //.sort({ date: -1 });
		res.json(subReddits);
	} catch (err) {
		res.status(404).json({ noSubRedditsFound: 'No subReddits found' });
	}
});

router.get('/:id', async (req, res) => {
	try {
		let subReddit = await SubReddit.findById(req.params.id);
		res.json(subReddit);
	} catch (err) {
		res
			.status(404)
			.json({ noSubRedditFound: 'No subReddit found with that ID' });
	}
});

router.post(
	'/',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		const { errors, isValid } = validateSubRedditInput(req.body);

		if (!isValid) {
			return res.status(400).json(errors);
		}

		const newSubReddit = new SubReddit({
			moderatorId: req.user.id,
			title: req.body.title,
			desc: req.body.desc,
		});

		await newSubReddit.save();
		res.json(newSubReddit);
	}
);
