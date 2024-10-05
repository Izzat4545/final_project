import { Request, Response } from "express";
import { User } from "../types/User";
// import { User } from "../types/User";
export const settingsController = async (req: Request, res: Response) => {
  // const { name, email, password, repeatPassword } = req.body;
  const user = req.user as User;
  console.log(user.email);

  res.end();

  // try {
  //   const user = await registerService(name, email, password, repeatPassword);
  //   res.status(201).json({ message: "User registered successfully", ...user });
  // } catch (error) {
  //   res.status(400).json({ error: (error as Error).message });
  // }
};
