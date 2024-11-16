const dynamoose = require('../config/dynamoose');

const CommentSchema = new dynamoose.Schema(
	{
		postId: {
			type: String,
			hashKey: true, // Partition key
			index: [
				{
					global: true,
					name: 'GSI_Hot',
					rangeKey: 'parenthPath_rankingScore_createdAt',
				},
				{
					global: true,
					name: 'GSI_Top',
					rangeKey: 'parentPath_netUpvotes_createdAt',
				},
				{
					global: true,
					name: 'GSI_New',
					rangeKey: 'parentPath_createdAt',
				},
			],
		},
		commentId: {
			type: String,
			rangeKey: true, // Sort key (for queries by post)
			index: [
				{
					global: true,
					name: 'GSI_Find_By_CommentId',
				},
			],
		},
		userId: {
			type: String,
			required: true,
		},
		author: {
			type: String,
			required: true,
		},
		topLevelCommentId: {
			type: String,
			required: false,
		},
		parentCommentId: {
			type: String,
			required: false, // Null for top-level comments
			index: [
				{
					global: true,
					name: 'GSI_Hot_Replies',
					rangeKey: 'parenthPath_rankingScore_createdAt',
				},
			],
		},
		body: {
			type: String,
			required: true,
		},
		depth: {
			type: String,
			default: '99',
		},
		replyCount: {
			type: Number,
			default: 0,
		},
		rankingScore: {
			type: Number,
			default: 0,
		},
		netUpvotes: {
			type: Number,
			default: 0,
		},
		parentPath: {
			type: String,
			default: '/',
		},
		// Composite Attributes for GSIs
		parentPath_rankingScore_createdAt: {
			type: String,
			required: true,
		},
		parentPath_netUpvotes_createdAt: {
			type: String,
			required: true,
		},
		parentPath_createdAt: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Comment = dynamoose.model('Comments', CommentSchema);

module.exports = Comment;
