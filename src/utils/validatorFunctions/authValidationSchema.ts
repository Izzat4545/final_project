import {
  codeType,
  loginType,
  registerType,
} from "../../types/validatorTypes/validatorTypes";
import Joi from "joi";

export const validateRigisterSchema = (query: registerType) => {
  const schema = Joi.object({
    name: Joi.string().min(4),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    repeatPassword: Joi.string().min(8).required(),
  });

  return schema.validate(query);
};

export const validateLoginSchema = (query: loginType) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  return schema.validate(query);
};

export const validateEmailSchema = (query: string) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  return schema.validate(query);
};

export const validateResetPasswordSchema = (query: codeType) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    code: Joi.string().required(),
  });

  return schema.validate(query);
};
