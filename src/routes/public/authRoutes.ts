import {
  googleAuth,
  googleAuthCallback,
  loginController,
  registerController,
  resetPasswordController,
  sendCodeController,
} from "../../controller/authController";
import {
  validateEmail,
  validateLogin,
  validateRegister,
  validateResetPassword,
} from "../../middleware/validators/authValidaton";
import { Router } from "express";
import passport from "passport";
import { rateLimiter } from "../../middleware/rateLimiter";

export const authRoutes = Router();

authRoutes.post("/register", rateLimiter, validateRegister, registerController);
authRoutes.post("/login", rateLimiter, validateLogin, loginController);

authRoutes.get("/google", googleAuth);
authRoutes.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  googleAuthCallback
);

authRoutes.post("/sendcode", validateEmail, sendCodeController);
authRoutes.post(
  "/resetpassword",
  validateResetPassword,
  resetPasswordController
);
