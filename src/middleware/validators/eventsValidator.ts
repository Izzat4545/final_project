import { NextFunction, Request, Response } from "express";
import {
  validateCreateEventSchema,
  validateUpdateEventSchema,
} from "../../utils/validatorScemas/eventsValidationSchema";
import { validatorMain } from "../../utils/validatorScemas/validatorMain";

export const validateEventCreation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validatedValue = validatorMain(validateCreateEventSchema, req, res);
  if (!validatedValue) {
    return;
  }
  next();
};

export const validateEventUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validatedValue = validatorMain(validateUpdateEventSchema, req, res);
  if (!validatedValue) {
    return;
  }
  next();
};
