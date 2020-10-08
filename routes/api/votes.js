const express = require('express');
const passport = require('passport');
const Post = require('../../models/Post');
const Vote = require('../../models/Vote');
// const validateVoteInput = require('../../validation/vote');

router.post(
	'/',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		// const { errors, isValid } = validateVoteInput(req.body);

		// if (!isValid) {
		// 	return res.status(400).json(errors);
		// }

		if (req.body.postId) {
			const post = await Post.findById(req.body.postId);
			if (post.currentVote != req.body.vote) {
				post.currentVote += req.body.vote;
			} else {
				post.currentVote -= req.body.vote;
			}
			const newVote = new Vote({
				userId: req.user.id,
				value: req.body.vote,
				postId: req.body.postId,
			});

			await newVote.save();
		} else {
			// add code for handling comment votes here
		}
		res.json(newVote);
		try {
		} catch (errors) {
			res.status(400).json(errors);
		}
	}
);
