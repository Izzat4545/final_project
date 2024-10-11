import {
  createGiftController,
  deleteGiftByIdController,
  getAllGiftsController,
  getGiftByIdController,
  updateGiftByIdController,
} from "../controller/giftsController";
import { Router } from "express";
import { eventAccessMiddleware } from "../middleware/eventAccessMiddleware";
import { upload } from "../config/imgUploadConfig";

export const giftRoutes = Router();

giftRoutes.post(
  "/gifts/:eventId",
  upload.single("image"),
  createGiftController
);
giftRoutes.get("/gifts/:eventId", eventAccessMiddleware, getAllGiftsController);
giftRoutes.get(
  "/gifts/:eventId/:giftId",
  eventAccessMiddleware,
  getGiftByIdController
);

giftRoutes.put(
  "/gifts/:eventId/:giftId",
  upload.single("image"),
  eventAccessMiddleware,
  updateGiftByIdController
);
giftRoutes.delete(
  "/gifts/:eventId/:giftId",
  eventAccessMiddleware,
  deleteGiftByIdController
);
