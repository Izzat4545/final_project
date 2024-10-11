import { authRoutes } from "./routes/authRoutes";
import { eventRoutes } from "./routes/eventsRoutes";
import express from "express";
import { getEnv } from "./utils/getEnv";
import { giftRoutes } from "./routes/giftsRoutes";
import helmet from "helmet";
import { isAuthenticated } from "./middleware/authMiddleware";
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

app.use(isAuthenticated, settinsRoutes);
app.use(isAuthenticated, eventRoutes);
app.use(isAuthenticated, giftRoutes);

export default app;
