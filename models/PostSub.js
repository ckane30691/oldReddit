const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSubSchema = new Schema({
	postId: {
		type: Schema.Types.ObjectId,
		ref: 'posts',
	},
	subId: {
		type: Schema.Types.ObjectId,
		ref: 'subReddits',
	},
});

module.exports = PostSub = mongoose.model('postSubs', PostSubSchema);
