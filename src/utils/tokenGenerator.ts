import { getEnv } from "./getEnv";
import jwt from "jsonwebtoken";

const JWT_SECRET = getEnv("JWT_SECRET");
const EXPIRATION = "1h";
export const generateToken = (id: string, email: string) => {
  return jwt.sign({ id, email }, JWT_SECRET, { expiresIn: EXPIRATION });
};
