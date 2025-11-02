const redis = require('redis');
const keys = require('./keys');
// Initialize Redis client

const isLocal = process.env.NODE_ENV === 'development';

let redisClient;

if (isLocal) {
	redisClient = redis.createClient({
		host: '127.0.0.1',
		port: 6379,
	});
} else {
	redisClient = redis.createClient({
		host: 'redis-16490.c289.us-west-1-2.ec2.redns.redis-cloud.com:16490',
		port: 6379,
		password: keys.redisPassword,
	});
}

redisClient.on('connect', () => {
	console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
	console.log('Redis Client Error', err);
});

module.exports = redisClient;
