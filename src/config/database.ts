import { Sequelize } from "sequelize";
import { getEnv } from "../utils/getEnv";

const username = getEnv("DB_USERNAME");
const password = getEnv("DB_PASSWORD");

export const sequelize = new Sequelize("users", username, password, {
  host: "localhost",
  dialect: "postgres",
});
