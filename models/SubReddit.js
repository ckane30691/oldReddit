const dynamoose = require('dynamoose');

const SubRedditSchema = new dynamoose.Schema({
	subRedditId: {
		type: String,
		required: true,
		hashKey: true,
	},
	moderatorId: {
		type: String,
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

const SubReddit = dynamoose.model('SubReddits', SubRedditSchema);

module.exports = SubReddit;
