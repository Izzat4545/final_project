import app from "./app";
import { getEnv } from "./utils/getEnv";
import { logger } from "./config/logger/loggerMain";
import { redisClient } from "./config/redis";
import { sequelize } from "./config/database";

const PORT = getEnv("PORT");

sequelize
  .sync()
  .then(() => {
    logger.info("Database connected and models synced");

    redisClient.connect();

    app.listen(PORT, () => {
      logger.info(`Server is running on port localhost:${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("Unable to connect to the database:", err);
  });
