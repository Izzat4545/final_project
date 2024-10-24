import { NextFunction, Request, Response } from "express";
import {
  validateAddPopularGiftSchema,
  validateCreateGiftSchema,
  validateUpdateGiftSchema,
} from "../../utils/validatorScemas/giftsValidationSchema";
import { validatorMain } from "../../utils/validatorScemas/validatorMain";

export const validateGiftCreation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validatedValue = validatorMain(validateCreateGiftSchema, req, res);
  if (!validatedValue) {
    return;
  }
  next();
};

export const validateGiftUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validatedValue = validatorMain(validateUpdateGiftSchema, req, res);
  if (!validatedValue) {
    return;
  }
  next();
};

export const validateAddPopularGiftToEvent = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validatedValue = validatorMain(validateAddPopularGiftSchema, req, res);
  if (!validatedValue) {
    return;
  }
  next();
};
