import { getEnv } from "./getEnv";
import jwt from "jsonwebtoken";

const JWT_SECRET = getEnv("JWT_SECRET");
export const generateToken = (id: number, email: string) => {
  return jwt.sign({ id, email }, JWT_SECRET, { expiresIn: "1h" });
};
