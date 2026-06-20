import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the Redis Client
const redisClient = createClient({
  url: process.env.REDIS_URI || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Cluster Connected!'));

await redisClient.connect();

export default redisClient;