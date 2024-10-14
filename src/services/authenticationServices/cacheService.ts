import { redisClient } from "../../config/redis";

export const storeResetCodeRedis = async (
  email: string,
  code: string
): Promise<void> => {
  const expiresIn = 10 * 60;
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
