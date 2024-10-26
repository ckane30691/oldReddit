const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSubSchema = new Schema({
	postId: {
		type: Schema.Types.ObjectId,
		ref: 'posts',
		required: true,
	},
	subId: {
		type: Schema.Types.ObjectId,
		ref: 'subReddits',
		required: true,
	},
});

module.exports = PostSub = mongoose.model('postSubs', PostSubSchema);
