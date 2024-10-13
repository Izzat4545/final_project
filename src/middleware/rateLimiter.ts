import RedisStore from "rate-limit-redis";
import rateLimit from "express-rate-limit";
import { redisClient } from "../config/redis";

export const rateLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: Array<string>) => redisClient.sendCommand(args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 30, // attemps
  message: { error: "please try again after 15 minutes" },
  statusCode: 429,
});
