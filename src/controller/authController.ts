import { Request, Response } from "express";
import {
  loginService,
  registerService,
  resetPasswordService,
  sendCodeService,
  verifyCodeService,
} from "../services/authService";
import passport from "passport";
import { randomCodeGenerator } from "../utils/randomCodeGenerator";

export const registerController = async (req: Request, res: Response) => {
  const { name, email, password, repeatPassword } = req.body;
  try {
    const user = await registerService(name, email, password, repeatPassword);
    res.status(201).json({ message: "User registered successfully", ...user });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await loginService(email, password);
    res.status(200).json({ message: "Login successful", ...user });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const sendCodeController = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const code = randomCodeGenerator();
    const send = await sendCodeService(email, code);
    res.status(200).json({ message: send });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const resetPasswordController = async (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body;
  try {
    const isValid = await verifyCodeService(email, code);
    if (isValid) {
      await resetPasswordService(email, newPassword);
      res.status(200).json({ message: "Password reset successfully!" });
    }
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleAuthCallback = (req: Request, res: Response) => {
  const user = req.user as { token: string };
  res.redirect(`http://localhost:5173/dashboard?token=${user.token}`);
};
