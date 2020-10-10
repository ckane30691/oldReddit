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
		try {
			if (req.body.postId) {
				let post = await handleVoteOnPost(req);
				debugger;
				res.json(post);
			} else {
				let comment = await handleVoteOnComment(req);
				debugger;
				res.json(comment);
			}
		} catch (errors) {
			res.status(400).json(errors);
		}
	}
);

const handleVoteOnPost = async (req) => {
	const [post, votes] = await Promise.all([
		Post.findById(req.body.postId),
		Vote.find({ postId: req.body.postId }),
	]);
	return handleVote(req, post, votes);
};

const handleVoteOnComment = async (req) => {
	const [comment, votes] = await Promise.all([
		Comment.findById(req.body.commentId),
		Vote.find({ commentId: req.body.commentId }),
	]);
	return handleVote(req, comment, votes);
};

const handleVote = async (req, document, votes) => {
	let hasVoted;
	let voteToSave;

	for (let i = 0; i < votes.length; i++) {
		let vote = votes[i];
		if (vote.userId == req.user.id) {
			hasVoted = true;
			if (vote.value == req.body.value) {
				vote.value -= req.body.value;
				document.voteCount -= req.body.value;
			} else {
				if (vote.value != 0) {
					if (req.body.value == -1) {
						document.voteCount += req.body.value - 1;
					} else {
						document.voteCount += req.body.value + 1;
					}
				} else {
					document.voteCount += req.body.value;
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
		document.votes.push(voteToSave.id);
		document.voteCount += req.body.value;
	}

	await Promise.all([voteToSave.save(), document.save()]);
	return document;
};
