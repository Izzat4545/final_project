import {
  googleAuth,
  googleAuthCallback,
  loginController,
  registerController,
  resetPasswordController,
  sendCodeController,
} from "../controller/authController";
import {
  validateEmail,
  validateLogin,
  validateRegister,
  validateResetPassword,
} from "../middleware/validators/authValidaton";
import { Router } from "express";
import passport from "passport";

export const authRoutes = Router();

authRoutes.post("/register", validateRegister, registerController);
authRoutes.post("/login", validateLogin, loginController);

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
