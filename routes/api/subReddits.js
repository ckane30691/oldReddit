const express = require('express');
const User = require('../../models/User');
const SubReddit = require('../../models/SubReddit');
const passport = require('passport');

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
