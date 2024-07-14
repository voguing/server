import Redis from "ioredis";

// 创建一个 Redis 客户端
const redis = new Redis(process.env.REDIS_URL as string);

export default redis;
