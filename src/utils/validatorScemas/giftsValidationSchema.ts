import Joi from "joi";
import { currency } from "../enums/currency";
import { giftType } from "../../types/validatorTypes/validatorTypes";

const TITLE_MIN_LENGTH = 3;
const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;

const baseGiftSchema = Joi.object({
  name: Joi.string().min(TITLE_MIN_LENGTH).max(TITLE_MAX_LENGTH),
  currency: Joi.string().valid(...Object.values(currency)),
  description: Joi.string().max(DESCRIPTION_MAX_LENGTH),
  image: Joi.string(),
  price: Joi.string(),
  link: Joi.string(),
});

export const validateCreateGiftSchema = (query: giftType) => {
  return baseGiftSchema
    .fork(["name", "currency", "price", "link"], (field) => field.required())
    .validate(query);
};

export const validateUpdateGiftSchema = (query: giftType) => {
  return baseGiftSchema.validate(query);
};
