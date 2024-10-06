import Joi from "joi";
import { settingsType } from "../../types/validatorTypes/validatorTypes";

export const validateSettingsSchema = (query: settingsType) => {
  const schema = Joi.object({
    newName: Joi.string().min(4),
    newEmail: Joi.string().email(),
    oldPassword: Joi.string().min(8).required(),
    newPassword: Joi.string().min(8).required(),
    repeatPassword: Joi.string().min(8).required(),
  });

  return schema.validate(query);
};
