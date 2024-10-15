const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'users',
		required: true,
	},
	postId: {
		type: Schema.Types.ObjectId,
		ref: 'posts',
		required: true,
	},
	parentCommentId: {
		type: Schema.Types.ObjectId,
		ref: 'comments',
	},
	childComments: [
		{
			type: Schema.Types.ObjectId,
			ref: 'comments',
		},
	],
	body: {
		type: String,
		required: [true, 'A body is required'],
	},
	netUpvotes: {
		type: Number,
		default: 0,
	},
});

module.exports = Comment = mongoose.model('comments', CommentSchema);
