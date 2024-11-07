const authenticate = require('../../utils/authenticate');
const { easyParse, calculateRankingScore } = require('../../utils/pagination');
const { v4: uuidv4 } = require('uuid');

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
		console.log('VOTE BODY: ', body);
		if (body.commentId) {
			response = await handleVoteOnComment(body, user);
		} else if (body.postId) {
			response = await handleVoteOnPost(body, user);
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
		Post.query('postId').eq(body.postId).limit(1).exec(),
		Vote.query('postId')
			.eq(body.postId)
			.using('GSI_Find_By_PostId')
			.where('userId')
			.eq(user.userId)
			.limit(1)
			.exec(),
	]);
	return handleVote(body, user, post[0], vote[0]);
};

const handleVoteOnComment = async (body, user) => {
	const [comment, vote] = await Promise.all([
		Comment.query('commentId').eq(body.commentId).limit(1).exec(),
		Vote.query('commentId')
			.eq(body.commentId)
			.using('GSI_Find_By_CommentId')
			.where('userId')
			.eq(user.userId)
			.limit(1)
			.exec(),
	]);
	return handleVote(body, user, comment[0], vote[0]);
};

const handleVote = async (body, user, document, vote) => {
	let voteToSave;
	const bodyValue = Number(body?.value);

	if (vote && vote.userId === user.userId) {
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
			voteId: uuidv4(),
			userId: user.userId,
			value: bodyValue,
			postId: body.postId || undefined,
			commentId: body.commentId || undefined,
		});
		document.netUpvotes += bodyValue;
		//TODO: Update composite attributes on comments
		// TODO: Invalidate Redis Cache
	}

	calculateRankingScore(document);
	// Make sure that we update composite attributes for comments here
	await Promise.all([voteToSave.save(), document.save()]);

	return document;
};
