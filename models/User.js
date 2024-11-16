const dynamoose = require('../config/dynamoose');

const UserSchema = new dynamoose.Schema(
	{
		userId: {
			type: String,
			hashKey: true, // Partition key
		},
		email: {
			type: String,
			rangeKey: true, // Sort Key
			index: {
				global: true,
				name: 'GSI_Email',
			},
		},
		username: {
			type: String,
			required: true,
		},
		passwordDigest: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const User = dynamoose.model('Users', UserSchema);

module.exports = User;
