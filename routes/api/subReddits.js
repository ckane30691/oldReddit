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
