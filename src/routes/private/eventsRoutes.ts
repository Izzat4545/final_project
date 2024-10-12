import {
  createEventController,
  deleteEventByIdController,
  getAllEventsController,
  getEventByIdController,
  updateEventByIdController,
} from "../../controller/eventsController";
import {
  validateEventCreation,
  validateEventUpdate,
} from "../../middleware/validators/eventsValidator";
import { Router } from "express";
import { isAuthenticated } from "../../middleware/authMiddleware";
import { upload } from "../../config/imgUploadConfig";

export const eventRoutes = Router();

eventRoutes.post(
  "/events",
  isAuthenticated,
  upload.single("image"),
  validateEventCreation,
  createEventController
);
eventRoutes.get("/events", isAuthenticated, getAllEventsController);
eventRoutes.get("/events/:pk", isAuthenticated, getEventByIdController);
eventRoutes.put(
  "/events/:pk",
  isAuthenticated,
  upload.single("image"),
  validateEventUpdate,
  updateEventByIdController
);
eventRoutes.delete("/events/:pk", isAuthenticated, deleteEventByIdController);
