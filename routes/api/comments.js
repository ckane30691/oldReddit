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
			const comment = new Comment({
				userId: req.user.id,
				postId: req.body.postId,
				body: req.body.body,
			});

			if (req.body.parentCommentId) {
				// const topLevelComment = await Comment.findById(
				// 	req.body.topLevelCommentId
				// );
				const [parentComment, post] = await Promise.all([
					Comment.findById(req.body.parentCommentId),
					Post.findById(req.body.postId),
				]);
				parentComment.childComments.push(comment.id);
				post.comments.push(comment.id);
				comment.parentCommentId = req.body.parentCommentId;
				await Promise.all([comment.save(), post.save(), parentComment.save()]);
			} else {
				const post = await Post.findById(req.body.postId);
				post.comments.push(comment.id);
				await Promise.all([comment.save(), post.save()]);
			}

			res.json(comment);
		} catch (errors) {
			console.log(errors);
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
