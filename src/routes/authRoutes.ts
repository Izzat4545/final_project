import { Router } from "express";
import {
  googleAuth,
  googleAuthCallback,
  loginController,
  registerController,
  resetPasswordController,
  sendCodeController,
} from "../controller/authController";
import passport from "passport";

export const authRoutes = Router();

authRoutes.post("/register", registerController);
authRoutes.post("/login", loginController);

authRoutes.get("/google", googleAuth);
authRoutes.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  googleAuthCallback
);

authRoutes.post("/sendcode", sendCodeController);
authRoutes.post("/resetpassword", resetPasswordController);
