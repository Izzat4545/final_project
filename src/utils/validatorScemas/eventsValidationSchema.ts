import { EventsType } from "../../types/validatorTypes/validatorTypes";
import Joi from "joi";
import { VisibilityModes } from "../enums/visibilityModes";

const TITLE_MIN_LENGTH = 3;
const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;

const baseEventSchema = Joi.object({
  title: Joi.string().min(TITLE_MIN_LENGTH).max(TITLE_MAX_LENGTH),
  date: Joi.date().iso(),
  visibility: Joi.string().valid(...Object.values(VisibilityModes)),

  description: Joi.string().max(DESCRIPTION_MAX_LENGTH),
  image: Joi.string(),
});

export const validateCreateEventSchema = (query: EventsType) => {
  return baseEventSchema
    .fork(["title", "date", "visibility"], (field) => field.required())
    .validate(query);
};

export const validateUpdateEventSchema = (query: EventsType) => {
  return baseEventSchema.validate(query);
};
