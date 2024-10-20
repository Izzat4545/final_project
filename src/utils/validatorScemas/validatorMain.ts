import { Request, Response } from "express";
import Joi from "joi";
import { logger } from "../../config/logger/loggerMain";

export function validatorMain(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validatorFunction: (input: any) => Joi.ValidationResult<any>,
  req: Request,
  res: Response
) {
  const { error, value } = validatorFunction(req.body);
  if (error) {
    logger.error(error.details[0].message);
    res.status(400).json({ error: error.details[0].message });
    return null;
  }
  return value;
}
