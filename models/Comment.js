const dynamoose = require('dynamoose');

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
		},
		userId: {
			type: String,
			required: true,
		},
		parentCommentId: {
			type: String,
			required: false, // Null for top-level comments
		},
		body: {
			type: String,
			required: true,
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
		// postId_parentPath: {
		// 	type: String,
		// 	required: true,
		// 	index: [
		// 		{
		// 			global: true,
		// 			name: 'GSI_Hot',
		// 			rangeKey: 'rankingScore_createdAt',
		// 		},
		// 		{
		// 			global: true,
		// 			name: 'GSI_Top',
		// 			rangeKey: 'netUpvotes_createdAt',
		// 		},
		// 		{
		// 			global: true,
		// 			name: 'GSI_New',
		// 			rangeKey: 'createdAt',
		// 		},
		// 	],
		// },
	},
	{
		timestamps: true,
	}
);

const Comment = dynamoose.model('Comments', CommentSchema);

module.exports = Comment;
