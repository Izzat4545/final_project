import { Sequelize } from "sequelize";
import { getEnv } from "../utils/getEnv";

const USERNAME = getEnv("DB_USERNAME");
const PASSWORD = getEnv("DB_PASSWORD");
const DB = getEnv("DB_NAME");
const HOST = getEnv("DB_HOST");
const PORT = parseInt(getEnv("DB_PORT")) || 5432;

export const sequelize = new Sequelize(DB, USERNAME, PASSWORD, {
  host: HOST,
  port: PORT,
  dialect: "postgres",
});
