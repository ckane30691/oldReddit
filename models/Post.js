const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'users',
			required: true,
		},
		title: {
			type: String,
			required: [true, 'Title is required'],
		},
		url: {
			type: String,
		},
		body: {
			type: String,
		},
		currentVote: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

module.exports = Post = mongoose.model('posts', PostSchema);
