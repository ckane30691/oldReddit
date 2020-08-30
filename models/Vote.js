const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VoteSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'users',
		required: true,
	},
	value: {
		type: Number,
		required: true,
	},
	commentId: {
		type: Schema.Types.ObjectId,
		ref: 'comments',
	},
	postId: {
		type: Schema.Types.postId,
		ref: 'posts',
	},
});

module.exports = Vote = mongoose.model('votes', VoteSchema);
