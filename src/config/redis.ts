import { createClient } from "redis";

export const redisClient = createClient();

redisClient.on("error", (err: any) => {
  console.error("Redis error: ", err);
});

redisClient.connect();
