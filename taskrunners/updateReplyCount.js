const AWS = require('aws-sdk');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const redisClient = require('../config/redisClient');
const { calculateRankingScore } = require('../utils/pagination');

(async () => {
	await redisClient.connect().catch(console.error);
})();

exports.handler = async (event) => {
	console.log('Inside DB Triggered Reply Count Update Taskrunner:');
	for (const record of event.Records) {
		if (record.eventName === 'INSERT') {
			const comment = AWS.DynamoDB.Converter.unmarshall(
				record.dynamodb.NewImage
			);

			// If reply update reply count on parent and on post
			if (comment.parentCommentId) {
				let [post, parentComment] = await Promise.all([
					Comment.query('commentId')
						.eq(comment.parentCommentId)
						.using('GSI_Find_By_CommentId')
						.limit(1)
						.exec(),
					Post.query('postId').eq(comment.postId).limit(1).exec(),
				]);

				post = post[0];
				parentComment = parentComment[0];

				post.replyCount += 1;
				parentComment.replyCount += 1;

				calculateRankingScore(post);
				calculateRankingScore(parentComment);

				const commentCacheKey = `comments:${comment.postId}:*`; // Invalidate all related comment caches
				const commentKeys = await redisClient.keys(commentCacheKey);
				for (let i = 0; i < commentKeys.length; i++) {
					let key = commentKeys[i];
					await redisClient.del(key);
				}

				const postCacheKey = `posts:${post.subReddit}:*`; // Invalidate all related post caches
				const postKeys = await redisClient.keys(postCacheKey);
				for (let i = 0; i < postKeys.length; i++) {
					let key = postKeys[i];
					await redisClient.del(key);
				}

				await Promise.all([post.save(), parentComment.save()]);
				console.log('POST AND PARENT COMMENT REPLY COUNT UPDATED');
			} else {
				// update reply count on post only
				let post = await Post.query('postId')
					.eq(comment.postId)
					.limit(1)
					.exec();

				post = post[0];

				post.replyCount += 1;

				calculateRankingScore(post);

				const postCacheKey = `posts:${post.subReddit}:*`; // Invalidate all related post caches
				const postKeys = await redisClient.keys(postCacheKey);
				for (let i = 0; i < postKeys.length; i++) {
					let key = postKeys[i];
					await redisClient.del(key);
				}

				await post.save();
				console.log('POST REPLY COUNT UPDATED');
			}
		}
	}
};
