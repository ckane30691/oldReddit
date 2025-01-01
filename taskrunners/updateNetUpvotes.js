const AWS = require('aws-sdk');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const redisClient = require('../config/redisClient');
const padWithZeros = require('../utils/padWithZeros');
const calculateRankingScore = require('../utils/calculateRankingScore');

const isLocal = process.env.NODE_ENV === 'development';

if (isLocal) {
	AWS.config.update({
		region: 'localhost',
		endpoint: 'http://localhost:8000', // Connect to local DynamoDB
	});
} else {
	AWS.config.update({
		region: 'us-west-1',
		// Credentials are automatically picked up if running with AWS CLI credentials
	});
}

(async () => {
	await redisClient.connect().catch(console.error);
})();

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
					.using('GSI_Find_By_CommentId')
					.limit(1)
					.exec();

				if (document[0]) {
					document = document[0];
					document.netUpvotes = (document.netUpvotes || 0) + voteChange;
					calculateRankingScore(document);
					const lengthOfPad = 6;
					const paddedRankingScore = padWithZeros(
						document.rankingScore,
						lengthOfPad
					);
					const paddedNetUpvotesScore = padWithZeros(
						document.netUpvotes,
						lengthOfPad
					);
					document.parentPath_rankingScore_createdAt = `${document.depth}_${document.parentPath}_${paddedRankingScore}_${document.createdAt}`;
					document.parentPath_netUpvotes_createdAt = `${document.depth}_${document.parentPath}_${paddedNetUpvotesScore}_${document.createdAt}`;

					// const cacheKey = `comments:${body.postId}:*`; // Invalidate all related comment caches
					// const keys = await redisClient.keys(cacheKey);
					// for (let i = 0; i < keys.length; i++) {
					// 	let key = keys[i];
					// 	await redisClient.del(key);
					// }
					await document.save();
					console.log('Comments net upvotes updated');
				}
			} else if (newVote.postId) {
				document = await Post.query('postId')
					.eq(newVote.postId)
					.limit(1)
					.exec();

				if (document[0]) {
					document = document[0];
					// Update net upvotes and ranking score
					document.netUpvotes = (document.netUpvotes || 0) + voteChange;
					calculateRankingScore(document);

					// TODO: Invalidate Redis Cache
					const cacheKey = `posts:${document.subReddit}:*`; // Invalidate all related post caches
					const keys = await redisClient.keys(cacheKey);
					for (let i = 0; i < keys.length; i++) {
						let key = keys[i];
						await redisClient.del(key);
					}
					await document.save();
					console.log('Posts net upvotes updated!');
				}
			}
		}
	}
};
