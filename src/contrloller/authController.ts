import { Request, Response } from "express";
import { loginService, registerService } from "../services/authService";

export const registerController = async (req: Request, res: Response) => {
  const { name, email, password, repeatPassword } = req.body;

  try {
    const user = await registerService(name, email, password, repeatPassword);
    res.status(201).json({ message: "User registered successfully", ...user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await loginService(email, password);
    res.status(200).json({ message: "Login successful", ...user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
