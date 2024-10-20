import Joi from "joi";
import { Currencies } from "../enums/currency";
import { GiftType } from "../../types/validatorTypes/validatorTypes";

const TITLE_MIN_LENGTH = 3;
const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;

const baseGiftSchema = Joi.object({
  name: Joi.string().min(TITLE_MIN_LENGTH).max(TITLE_MAX_LENGTH),
  currency: Joi.string().valid(...Object.values(Currencies)),
  description: Joi.string().max(DESCRIPTION_MAX_LENGTH),
  image: Joi.string(),
  price: Joi.string(),
  link: Joi.string(),
});

export const validateCreateGiftSchema = (query: GiftType) => {
  return baseGiftSchema
    .fork(["name", "currency", "price", "link"], (field) => field.required())
    .validate(query);
};

export const validateUpdateGiftSchema = (query: GiftType) => {
  return baseGiftSchema.validate(query);
};
