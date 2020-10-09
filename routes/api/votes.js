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
			const [post, votes] = await Promise.all([
				Post.findById(req.body.postId),
				Vote.find({ postId: req.body.postId }),
			]);

			let hasVoted;

			let voteToSave;

			for (let i = 0; i < votes.length; i++) {
				let vote = votes[i];
				if (vote.userId == req.user.id) {
					hasVoted = true;
					if (vote.value == req.body.value) {
						vote.value -= req.body.value;
						post.voteCount -= req.body.value;
					} else {
						if (vote.value != 0) {
							if (req.body.value == -1) {
								post.voteCount += req.body.value - 1;
							} else {
								post.voteCount += req.body.value + 1;
							}
						} else {
							post.voteCount += req.body.value;
						}
						vote.value = req.body.value;
					}
					voteToSave = vote;
				}
			}

			if (!hasVoted) {
				voteToSave = new Vote({
					userId: req.user.id,
					value: req.body.value,
					postId: req.body.postId,
				});
				post.votes.push(voteToSave.id);
				post.voteCount += req.body.value;
			}

			await Promise.all([voteToSave.save(), post.save()]);
			res.json(post);
		} else {
			// add code for handling comment votes here
		}
		try {
		} catch (errors) {
			res.status(400).json(errors);
		}
	}
);
