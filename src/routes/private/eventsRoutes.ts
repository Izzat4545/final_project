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
eventRoutes.get("/events/:id", isAuthenticated, getEventByIdController);
eventRoutes.put(
  "/events/:id",
  isAuthenticated,
  upload.single("image"),
  validateEventUpdate,
  updateEventByIdController
);
eventRoutes.delete("/events/:id", isAuthenticated, deleteEventByIdController);
