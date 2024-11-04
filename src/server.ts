import "./models/asosiations";
import { app } from "./app";
import { getEnv } from "./utils/getEnv";
import { logger } from "./config/logger/loggerMain";
import { sequelize } from "./config/database";

const PORT = getEnv("PORT");

sequelize
  .sync({ alter: true })
  .then(() => {
    logger.info("Database connected and models synced");

    app.listen(PORT, () => {
      logger.info(`Server is running on port localhost:${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("Unable to connect to the database:", err);
  });
