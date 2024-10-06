import { authRoutes } from "./routes/authRoutes";
import express from "express";
import { getEnv } from "./utils/getEnv";
import helmet from "helmet";
import passport from "passport";
import { requestLogger } from "./middleware/requestLogger";
import session from "express-session";
import { settinsRoutes } from "./routes/settingsRoutes";

const app = express();
app.use(express.json());
app.use(requestLogger);
app.use(helmet());

app.use(
  session({
    secret: getEnv("SESSION_SECRET"),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);

app.use(settinsRoutes);

export default app;
