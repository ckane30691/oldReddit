const dynamoose = require('dynamoose');

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
			required: true,
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
		rankingScore: {
			type: Number,
			default: 0,
		},
		netUpvotes: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

const Post = dynamoose.model('Posts', PostSchema);

module.exports = Post;
