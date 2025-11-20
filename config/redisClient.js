const redis = require('redis');
const keys = require('./keys');
// Initialize Redis client

const isLocal = process.env.NODE_ENV === 'development';

const redisClient = redis.createClient({
	url: isLocal
		? 'redis://127.0.0.1:6379'
		: `redis://:${process.env.REDIS_PASSWORD}@redis-19321.c90.us-east-1-3.ec2.cloud.redislabs.com:19321`,
});

redisClient.on('connect', () => {
	console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
	console.log('Redis Client Error', err);
});

module.exports = redisClient;
