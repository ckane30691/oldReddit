const express = require('express');
const Post = require('../../models/Post');
const passport = require('passport');
// const validatePostInput = require('../../validation/posts');

const router = express.Router(/*{ mergeParams: true }*/);

module.exports = router;

router.get('/:id', async (req, res) => {
	try {
		let post = await Post.findById(req.params.id);
		res.json(post);
	} catch (errors) {
		res.status(404).json({ noPostFound: "That post doesn't exist" });
	}
});
