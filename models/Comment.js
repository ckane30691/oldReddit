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
					rangeKey: 'rankingScore',
				},
				{
					global: true,
					name: 'GSI_Top',
					rangeKey: 'netUpvotes',
				},
				{
					global: true,
					name: 'GSI_New',
					rangeKey: 'createdAt',
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
	},
	{
		timestamps: true, // Automatically manage createdAt and updatedAt
		// indexes: [
		// 	{
		// 		// Hot Index
		// 		name: 'GSI_Hot',
		// 		partitionKey: 'postId',
		// 		sortKey: 'rankingScore',
		// 	},
		// 	{
		// 		// Top Index
		// 		name: 'GSI_Top',
		// 		partitionKey: 'postId',
		// 		sortKey: 'netUpvotes',
		// 	},
		// 	{
		// 		// New Index
		// 		name: 'GSI_New',
		// 		partitionKey: 'postId',
		// 		sortKey: 'createdAt',
		// 	},
		// ],
	}
);

const Comment = dynamoose.model('Comments', CommentSchema);

module.exports = Comment;
