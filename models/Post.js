const dynamoose = require('../config/dynamoose');

const PostSchema = new dynamoose.Schema(
	{
		postId: {
			type: String,
			hashKey: true, //Partition Key
		},
		userId: {
			type: String,
			required: true,
		},
		author: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		postSuffix: {
			type: String,
			required: true,
		},
		subReddit: {
			type: String,
			rangeKey: true, //Sort Key
			required: true,
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
		redirectLink: {
			type: String,
		},
		objectStorageLink: {
			type: String,
		},
		body: {
			type: String,
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
	},
	{
		create: true,
		update: true,
		timestamps: true,
	}
);

const Post = dynamoose.model('Posts', PostSchema);

module.exports = Post;
