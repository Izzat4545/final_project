import { Request, Response } from "express";
import {
  editProfileService,
  getProfileService,
} from "../services/settingsService/settingsService";
import { UserType } from "../types/User";

export const settingsUpdateController = async (req: Request, res: Response) => {
  const {
    oldPassword,
    newPassword,
    repeatPassword,
    newEmail,
    newName,
    currency,
  } = req.body;
  try {
    const user = req.user as UserType;
    const profile = await editProfileService(
      user.id,
      oldPassword,
      newPassword,
      repeatPassword,
      currency,
      newEmail,
      newName
    );

    res.status(201).send(profile);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const settingsGetController = async (req: Request, res: Response) => {
  const user = req.user as UserType;
  try {
    const profile = await getProfileService(user.id);

    res.status(201).send(profile);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
