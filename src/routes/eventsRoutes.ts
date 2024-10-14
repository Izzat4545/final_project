import {
  createEventController,
  deleteEventByIdController,
  getAllEventsController,
  getEventByIdController,
  updateEventByIdController,
} from "../controller/eventsController";
import {
  validateEventCreation,
  validateEventUpdate,
} from "../middleware/validators/eventsValidator";
import { Router } from "express";
import { upload } from "../config/imgUploadConfig";

export const eventRoutes = Router();

eventRoutes.post(
  "/events",
  upload.single("image"),
  validateEventCreation,
  createEventController
);
eventRoutes.get("/events", getAllEventsController);
eventRoutes.get("/events/:pk", getEventByIdController);
eventRoutes.put(
  "/events/:pk",
  upload.single("image"),
  validateEventUpdate,
  updateEventByIdController
);
eventRoutes.delete("/events/:pk", deleteEventByIdController);
