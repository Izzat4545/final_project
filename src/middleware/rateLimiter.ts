import RedisStore from "rate-limit-redis";
import rateLimit from "express-rate-limit";
import { redisClient } from "../config/redis";

const MINUTES = 15;
const SECONDS = 60;
const MILLISECONDS = 1000;

export const rateLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: Array<string>) => redisClient.sendCommand(args),
  }),
  windowMs: MINUTES * SECONDS * MILLISECONDS,
  max: 30, // attemps
  message: { error: "please try again after 15 minutes" },
  statusCode: 429,
});
