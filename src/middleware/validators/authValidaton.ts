import { NextFunction, Request, Response } from "express";
import {
  validateEmailSchema,
  validateLoginSchema,
  validateResetPasswordSchema,
  validateRigisterSchema,
} from "../../utils/validatorFunctions/authValidationSchema";
import { validatorMain } from "../../utils/validatorFunctions/validatorMain";

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validatedValue = validatorMain(validateRigisterSchema, req, res);
  if (!validatedValue) {
    return;
  }
  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validatedValue = validatorMain(validateLoginSchema, req, res);
  if (!validatedValue) {
    return;
  }
  next();
};

export const validateEmail = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validatedValue = validatorMain(validateEmailSchema, req, res);
  if (!validatedValue) {
    return;
  }
  next();
};

export const validateResetPassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validatedValue = validatorMain(validateResetPasswordSchema, req, res);
  if (!validatedValue) {
    return;
  }
  next();
};
