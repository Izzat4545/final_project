import {
  createEventController,
  deleteEventByIdController,
  getAllEventsController,
  getEventByIdController,
  updateEventByIdController,
} from "../controller/eventsController";
import { Router } from "express";

export const eventRoutes = Router();

eventRoutes.post("/events", createEventController);
eventRoutes.get("/events", getAllEventsController);
eventRoutes.get("/events/:pk", getEventByIdController);
eventRoutes.put("/events/:pk", updateEventByIdController);
eventRoutes.delete("/events/:pk", deleteEventByIdController);
