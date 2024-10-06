import { NextFunction, Request, Response } from "express";
import { validateSettingsSchema } from "../../utils/validatorFunctions/settingsValidationSchema";
import { validatorMain } from "../../utils/validatorFunctions/validatorMain";

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
