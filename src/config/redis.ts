import { RedisError } from "redis-errors";
import { createClient } from "redis";
export const redisClient = createClient();

redisClient.on("error", (err: RedisError) => {
  console.error("Redis error: ", err.message);
});

redisClient.connect();
