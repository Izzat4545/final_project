import { Sequelize } from "sequelize";
import { getEnv } from "../utils/getEnv";

const username = getEnv("DB_USERNAME");
const password = getEnv("DB_PASSWORD");
const db = getEnv("DB_NAME");
const host = getEnv("DB_HOST");

export const sequelize = new Sequelize(db, username, password, {
  host: host,
  dialect: "postgres",
});
