const dynamoose = require('../config/dynamoose');

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
	category: {
		type: String,
		index: {
			global: true,
			name: 'GSI_Category',
		},
	},
});

const SubReddit = dynamoose.model('SubReddits', SubRedditSchema, {
	update: false,
	create: false,
	waitForActive: false,
});

module.exports = SubReddit;
