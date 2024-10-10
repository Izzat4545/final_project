import Joi from "joi";
import { eventsType } from "../../types/validatorTypes/validatorTypes";
import { visibilityModes } from "../enums/visibilityModes";

const TITLE_MIN_LENGTH = 3;
const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;

const baseEventSchema = Joi.object({
  title: Joi.string().min(TITLE_MIN_LENGTH).max(TITLE_MAX_LENGTH),
  date: Joi.date().iso(),
  visibility: Joi.string().valid(...Object.values(visibilityModes)),

  description: Joi.string().max(DESCRIPTION_MAX_LENGTH),
  image: Joi.string(),
});

export const validateCreateEventSchema = (query: eventsType) => {
  return baseEventSchema
    .fork(["title", "date", "visibility"], (field) => field.required())
    .validate(query);
};

export const validateUpdateEventSchema = (query: eventsType) => {
  return baseEventSchema.validate(query);
};
