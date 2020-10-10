const express = require('express');
const Comment = require('../../models/Comment');
const passport = require('passport');
const validateCommentInput = require('../../validation/comment');
const Post = require('../../models/Post');

const router = express.Router();

module.exports = router;

router.get('/', async (req, res) => {
	try {
		let comments = await Comment.find({ postId: req.body.postId });
		res.json(comments);
	} catch (err) {
		res.status(404).json({ noCommentsFound: 'No comments yet' });
	}
});

router.post(
	'/',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		const { errors, isValid } = validateCommentInput(req.body);
		if (!isValid) {
			return res.status(400).json(errors);
		}
		try {
			const post = await Post.findById(req.body.postId);
			const comment = new Comment({
				userId: req.user.id,
				postId: req.body.postId,
				body: req.body.body,
				parentCommentId: req.body.parentCommentId,
			});
			post.comments.push(comment.id);

			await Promise.all([comment.save(), post.save()]);
			res.json(comment);
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
			let comment = await Comment.findById(req.params.id);
			if (!comment)
				return res
					.status(404)
					.json({ noCommentFound: "That comment doesn't exist" });
			if (req.user.id == comment.userId) {
				await comment.deleteOne();
				return res.json(comment);
			}
			res.status(403).json({
				notAuthorized: 'You did not make this comment',
			});
		} catch (errors) {
			res.status(400).json(errors);
		}
	}
);
