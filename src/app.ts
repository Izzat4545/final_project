import { authRoutes } from "./routes/public/authRoutes";
import cors from "cors";
import { eventRoutes } from "./routes/private/eventsRoutes";
import express from "express";
import { getEnv } from "./utils/getEnv";
import { giftRoutes } from "./routes/private/giftsRoutes";
import { giftsPublicRoutes } from "./routes/public/giftsPublicRoutes";
import helmet from "helmet";
import { initializeGoogleStrategy } from "./services/authenticationServices/googleAuthService";
import passport from "passport";
import { requestLogger } from "./middleware/requestLogger";
import session from "express-session";
import { settinsRoutes } from "./routes/private/settingsRoutes";

export const app = express();
app.use(express.json());
app.use(requestLogger);
const corsOptions = {
  origin: getEnv("CORS_ORIGINS").split(",") || [],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(helmet());

app.use(
  session({
    secret: getEnv("SESSION_SECRET"),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

initializeGoogleStrategy();

app.use(passport.initialize());
app.use(passport.session());

app.use("/uploads", express.static(getEnv("STATIC_FILES")));
app.use("/auth", authRoutes);

app.use(settinsRoutes);
app.use(eventRoutes);
app.use(giftRoutes);

app.use(giftsPublicRoutes);
