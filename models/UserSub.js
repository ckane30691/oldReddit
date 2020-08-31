const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSubSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'users',
		required: true,
	},
	subId: {
		type: Schema.Types.ObjectId,
		ref: 'subReddits',
		required: true,
	},
});

module.exports = PostSub = mongoose.model('userSubs', UserSubSchema);
