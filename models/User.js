const dynamoose = require('dynamoose');

const UserSchema = new dynamoose.Schema(
	{
		userId: {
			type: String,
			hashKey: true, // Partition key
		},
		email: {
			type: String,
			rangeKey: true, // Sort Key
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
		indexes: [
			{
				name: 'GSI_Email',
				hashKey: 'email', // Partition Key for GSI
			},
		],
	}
);

const User = dynamoose.model('Users', UserSchema);

module.exports = User;
