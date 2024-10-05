import { RedisError } from "redis-errors";
import { createClient } from "redis";
import { logger } from "./logger/loggerMain";

export const redisClient = createClient();

redisClient.on("error", (err: RedisError) => {
  logger.error("Redis error: ", err.message);
});

redisClient.on("connect", () => {
  logger.info("Successfully connected to Redis");
});
