const express = require('express');
const passport = require('passport');
const Post = require('../../models/Post');
const Vote = require('../../models/Vote');
// const validateVoteInput = require('../../validation/vote');

const router = express.Router();

module.exports = router;

router.post(
	'/',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		// const { errors, isValid } = validateVoteInput(req.body);

		// if (!isValid) {
		// 	return res.status(400).json(errors);
		// }

		if (req.body.postId) {
			//TODO: Move this code into helper fn called handleVoteOnPost
			const post = await Post.findById(req.body.postId);
			if (post.currentVote != req.body.value) {
				post.currentVote += req.body.value;
			} else {
				post.currentVote -= req.body.vote;
			}
			const newVote = new Vote({
				userId: req.user.id,
				value: req.body.value,
				postId: req.body.postId,
			});

			await newVote.save();
			res.json(newVote);
		} else {
			// add code for handling comment votes here
		}
		try {
		} catch (errors) {
			res.status(400).json(errors);
		}
	}
);
