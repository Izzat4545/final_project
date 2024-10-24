import { Currencies } from "../enums/currency";
import Joi from "joi";
import { SettingsType } from "../../types/validatorTypes/validatorTypes";

export const validateSettingsSchema = (query: SettingsType) => {
  const schema = Joi.object({
    newName: Joi.string().min(4).optional(),
    currency: Joi.string()
      .valid(...Object.keys(Currencies))
      .optional(),
    newEmail: Joi.string().email().optional(),

    // Conditional password validation
    oldPassword: Joi.string()
      .min(8)
      .when("newPassword", {
        is: Joi.exist(),
        then: Joi.required(),
      })
      .when("repeatPassword", {
        is: Joi.exist(),
        then: Joi.required(),
      }),
    newPassword: Joi.string().min(8).optional(),
    repeatPassword: Joi.string()
      .min(8)
      .optional()
      .valid(Joi.ref("newPassword"))
      .messages({ "any.only": "Passwords do not match" }),
  }).or("newPassword", "newName", "newEmail", "currency");

  return schema.validate(query);
};
