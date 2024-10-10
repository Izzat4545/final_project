import { NextFunction, Request, Response } from "express";
import { validateSettingsSchema } from "../../utils/validatorScemas/settingsValidationSchema";
import { validatorMain } from "../../utils/validatorScemas/validatorMain";

export const validateSettings = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validatedValue = validatorMain(validateSettingsSchema, req, res);
  if (!validatedValue) {
    return;
  }
  next();
};
