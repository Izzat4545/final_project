import { Request, Response } from "express";
import { UserType } from "../types/User";
import { editProfileService } from "../services/settingsService/settingsService";

export const settingsController = async (req: Request, res: Response) => {
  const { oldPassword, newPassword, repeatPassword, newEmail, newName } =
    req.body;
  try {
    const user = req.user as UserType;
    const profile = await editProfileService(
      user.email,
      oldPassword,
      newPassword,
      repeatPassword,
      newEmail,
      newName
    );

    res.status(201).send(profile);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
