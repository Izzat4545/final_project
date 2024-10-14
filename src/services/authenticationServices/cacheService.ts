import { redisClient } from "../../config/redis";

export const storeResetCodeRedis = async (
  email: string,
  code: string
): Promise<void> => {
  const MINUTE = 10;
  const SECOND = 60;
  const expiresIn = MINUTE * SECOND;
  await redisClient.set(`resetCode:${email}`, code, { EX: expiresIn });
};

export const getResetCodeRedis = async (
  email: string
): Promise<string | null> => {
  const code = await redisClient.get(`resetCode:${email}`);
  return code;
};

export const deleteResetCodeRedis = async (email: string): Promise<void> => {
  await redisClient.del(`resetCode:${email}`);
};
