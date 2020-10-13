const express = require('express');
const SubReddit = require('../../models/SubReddit');
const UserSub = require('../../models/UserSub');
const passport = require('passport');
const validateSubRedditInput = require('../../validation/subReddit');

const router = express.Router();

module.exports = router;

router.get('/', async (req, res) => {
	try {
		let subReddits = req.query.filters
			? await SubReddit.find()
			: await SubReddit.find({ userId: req.query.filters }); //.sort({ date: -1 });

		res.json(subReddits);
	} catch (err) {
		res.status(404).json({ noSubRedditsFound: 'No subReddits found' });
	}
});

router.get('/:id', async (req, res) => {
	try {
		let subReddit = await SubReddit.findById(req.params.id).populate('posts');
		res.json(subReddit);
	} catch (errors) {
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
		try {
			const newSubReddit = new SubReddit({
				moderatorId: req.user.id,
				title: req.body.title,
				desc: req.body.desc,
			});

			await newSubReddit.save();
			res.json(newSubReddit);
		} catch (errors) {
			res.status(400).json(errors);
		}
	}
);

// Subscribe to SubReddit
router.post(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		try {
			const newUserSub = new UserSub({
				userId: req.user.id,
				subId: req.params.id,
			});

			await newUserSub.save();
			res.json(newUserSub);
		} catch (errors) {
			res.status(400).json(errors);
		}
	}
);

router.delete(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		try {
			let subReddit = await SubReddit.findById(req.params.id);
			if (!subReddit)
				return res
					.status(404)
					.json({ noSubRedditFound: "That subreddit doesn't exist" });
			if (req.user.id == subReddit.moderatorId) {
				await subReddit.deleteOne();
				return res.json(subReddit);
			}
			res.status(403).json({
				notAuthorized:
					'You must be the moderator of this subreddit to delete it!',
			});
		} catch (errors) {
			res.status(400).json(errors);
		}
	}
);
