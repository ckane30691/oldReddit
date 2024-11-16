const dynamoose = require('../config/dynamoose');

const VoteSchema = new dynamoose.Schema({
	voteId: {
		type: String,
		hashKey: true,
	},
	userId: {
		type: String,
		required: true,
	},
	value: {
		type: Number,
		required: true,
	},
	commentId: {
		type: String,
		required: false,
		index: [
			{
				global: true,
				name: 'GSI_Find_By_CommentId',
				rangeKey: 'userId',
			},
		],
	},
	postId: {
		type: String,
		required: false,
		index: [
			{
				global: true,
				name: 'GSI_Find_By_PostId',
				rangeKey: 'userId',
			},
		],
	},
});

const Vote = dynamoose.model('Votes', VoteSchema);

module.exports = Vote;
