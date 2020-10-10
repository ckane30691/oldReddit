const express = require('express');
const Post = require('../../models/Post');
const PostSub = require('../../models/PostSub');
const passport = require('passport');
const validatePostInput = require('../../validation/post');

const router = express.Router();

module.exports = router;

router.get('/', async (req, res) => {
	try {
		let posts = await Post.find().sort({ voteCount: -1 });
		// if (!posts) return res.status(404).json({ noPostsFound: 'No posts found' });
		return res.json(posts);
	} catch (errors) {
		res.status(400).json(errors);
	}
});

router.get('/:id', async (req, res) => {
	try {
		let post = await Post.findById(req.params.id);
		res.json(post);
	} catch (errors) {
		res.status(404).json({ noPostFound: "That post doesn't exist" });
	}
});

router.post(
	'/',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		// TODO: REWORK CONTROLLER TO ALLOW USERS TO POST TO THEIR OWN PROFILES AS WELL AS SUBS
		const { errors, isValid } = validatePostInput(req.body);
		if (!isValid) {
			return res.status(400).json(errors);
		}
		try {
			// How can I make these entries ATOMIC?
			const newPost = new Post({
				userId: req.user.id,
				title: req.body.title,
				url: req.body.url,
				body: req.body.body,
			});
			const newPostSub = new PostSub({
				postId: newPost._id,
				subId: req.body.subId,
			});
			await newPost.save();
			await newPostSub.save();
			res.json(newPost);
		} catch (errors) {
			res.status(400).json(errors);
		}
	}
);
