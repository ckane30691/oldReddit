const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TODO: CONVERT THIS SO THAT SUBS IS AN ARRAY AND THEN WE CAN JUST QUERY USERSUBS AND POPULATE SUBS

const UserSubSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'users',
		required: true,
	},
	subs: [
		{
			type: Schema.Types.ObjectId,
			ref: 'subReddits',
			required: true,
		},
	],
});

module.exports = PostSub = mongoose.model('userSubs', UserSubSchema);
