const dynamoose = require('dynamoose');

// Check if we are in an offline environment and configure Dynamoose to use DynamoDB Local
if (process.env.NODE_ENV === 'development') {
	dynamoose.aws.ddb.local('http://localhost:8000'); // Local DynamoDB
} else {
	dynamoose.Table.defaults.set({
		create: false,
	});
}

module.exports = dynamoose;
