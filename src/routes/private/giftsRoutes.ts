import {
  createGiftController,
  deleteGiftByIdController,
  updateGiftByIdController,
} from "../../controller/giftsController";
import { Router } from "express";
import { isAuthenticated } from "../../middleware/authMiddleware";
import { upload } from "../../config/imgUploadConfig";

export const giftRoutes = Router();

giftRoutes.post(
  "/gifts/:eventId",
  isAuthenticated,
  upload.single("image"),
  createGiftController
);
giftRoutes.put(
  "/gifts/:giftId",
  upload.single("image"),
  isAuthenticated,
  updateGiftByIdController
);
giftRoutes.delete("/gifts/:giftId", isAuthenticated, deleteGiftByIdController);
