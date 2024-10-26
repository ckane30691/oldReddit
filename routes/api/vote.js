const mongoose = require('mongoose');
const authenticate = require('../../utils/authenticate');
const keys = require('../../config/keys');
const { easyParse, calculateRankingScore } = require('../../utils/pagination');

mongoose.connect(keys.mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const Vote = require('../../models/Vote');

exports.handler = async (event) => {
	const token = easyParse(event).headers.authorization?.split(' ')[1];

	if (!token) {
		return {
			statusCode: 403,
			body: JSON.stringify({ message: 'Authorization token missing' }),
		};
	}

	try {
		const user = await authenticate(token);

		if (!user) {
			return {
				statusCode: 401,
				body: JSON.stringify({ message: 'Invalid token' }),
			};
		}

		const body = easyParse(event.body);

		// Handle vote on a post or a comment
		let response;
		if (body.postId) {
			response = await handleVoteOnPost(body, user);
		} else if (body.commentId) {
			response = await handleVoteOnComment(body, user);
		} else {
			return {
				statusCode: 400,
				body: JSON.stringify({
					message: 'postId or commentId must be provided',
				}),
			};
		}

		return {
			statusCode: 200,
			body: JSON.stringify(response),
		};
	} catch (error) {
		console.log(error);
		return {
			statusCode: 500,
			body: JSON.stringify({ message: 'Internal server error', error }),
		};
	}
};

const handleVoteOnPost = async (body, user) => {
	const [post, vote] = await Promise.all([
		Post.findById(body.postId),
		Vote.findOne({ postId: body.postId, userId: user._id }),
	]);
	return handleVote(body, user, post, vote);
};

const handleVoteOnComment = async (body, user) => {
	const [comment, vote] = await Promise.all([
		Comment.findById(body.commentId),
		Vote.findOne({ commentId: body.commentId, userId: user._id }),
	]);
	return handleVote(body, user, comment, vote);
};

const handleVote = async (body, user, document, vote) => {
	let voteToSave;
	const bodyValue = Number(body?.value);

	if (vote && vote.userId?.toString() == user?._id?.toString()) {
		const voteValue = Number(vote.value);
		if (voteValue === bodyValue) {
			document.netUpvotes -= voteValue;
			vote.value = 0;
		} else {
			document.netUpvotes += bodyValue - voteValue;
			vote.value = bodyValue;
		}
		voteToSave = vote;
	} else {
		voteToSave = new Vote({
			userId: user._id,
			value: bodyValue,
			postId: body.postId || undefined,
			commentId: body.commentId || undefined,
		});
		document.netUpvotes += bodyValue;
	}

	calculateRankingScore(document);
	await Promise.all([voteToSave.save(), document.save()]);

	return document;
};
