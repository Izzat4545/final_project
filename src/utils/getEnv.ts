import dotenv from "dotenv";

dotenv.config();

export const getEnv = (key: string, defaultValue: string = ""): string => {
  const value = process.env[key];
  if (typeof value === "undefined" || value === "") {
    return defaultValue;
  }
  return value;
};
