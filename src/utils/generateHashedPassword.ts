import { ICreatedHashedPassword } from "../types/ICreatedHashedPassword";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

export const generateHashedPassword = async (
  password: string
): Promise<ICreatedHashedPassword> => {
  const salt = nanoid(60);
  const hashedPassword = await bcrypt.hash(password + salt, 12);
  return {
    salt,
    hashedPassword,
  };
};
