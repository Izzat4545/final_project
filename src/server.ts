import app from "./app";
import { sequelize } from "./config/database";
import { getEnv } from "./utils/getEnv";

const PORT = getEnv("PORT");

sequelize
  .sync()
  .then(() => {
    console.log("Database connected and models synced");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
