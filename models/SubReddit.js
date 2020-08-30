const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubRedditSchema = new Schema({
	moderatorId: {
		type: Schema.Types.ObjectId,
		ref: 'users',
		required: true,
	},
	title: {
		type: String,
		required: [true, 'Title is required'],
	},
	desc: {
		type: String,
		required: [true, 'A description is required'],
	},
});

module.exports = SubReddit = mongoose.model('subReddits', SubRedditSchema);
