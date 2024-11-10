const AWS = require('aws-sdk');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

exports.handler = async (event) => {
	console.log('Inside DB Triggered Taskrunner:');
	for (const record of event.Records) {
		if (record.eventName === 'INSERT' || record.eventName === 'MODIFY') {
			const newVote = AWS.DynamoDB.Converter.unmarshall(
				record.dynamodb.NewImage
			);
			const oldVote = record.dynamodb.OldImage
				? AWS.DynamoDB.Converter.unmarshall(record.dynamodb.OldImage)
				: null;

			// Determine vote change (e.g., -1 to +1, +1 to 0)
			const previousValue = oldVote ? Number(oldVote.value) : 0;
			const newValue = Number(newVote.value);
			const voteChange = newValue - previousValue;

			let document;

			if (newVote.commentId) {
				document = await Comment.query('commentId')
					.eq(newVote.commentId)
					.limit(1)
					.exec();
			} else if (newVote.postId) {
				document = await Post.query('postId')
					.eq(newVote.postId)
					.limit(1)
					.exec();
			}

			if (document[0]) {
				document = document[0];
				// Update net upvotes and ranking score
				document.netUpvotes = (document.netUpvotes || 0) + voteChange;
				calculateRankingScore(document);
				console.log('DOCUMENT NETUPVOTES UPDATED!');
				await document.save();

				//TODO: Update composite attributes on comments
				// TODO: Invalidate Redis Cache
			}
		}
	}
};

const calculateRankingScore = (item) => {
	const G = 1.8; // The decay factor (adjust as needed)

	// Get the number of hours since the post was created
	const now = new Date();
	const postAgeInMilliseconds = now - item.createdAt;
	const postAgeInHours = postAgeInMilliseconds / (1000 * 60 * 60); // Convert ms to hours
	// Calculate the rankingScore using the netUpvotes
	const rankingScore = item.netUpvotes / Math.pow(postAgeInHours + 2, G);

	item.rankingScore = rankingScore;
};
