import {
  createGiftController,
  deleteGiftByIdController,
  updateGiftByIdController,
} from "../../controller/giftsController";
import {
  validateGiftCreation,
  validateGiftUpdate,
} from "../../middleware/validators/giftsValidation";
import { Router } from "express";
import { isAuthenticated } from "../../middleware/authMiddleware";
import { upload } from "../../config/imgUploadConfig";

export const giftRoutes = Router();

giftRoutes.post(
  "/gifts/:eventId",
  isAuthenticated,
  upload.single("image"),
  validateGiftCreation,
  createGiftController
);
giftRoutes.put(
  "/gifts/:giftId",
  isAuthenticated,
  upload.single("image"),
  validateGiftUpdate,
  updateGiftByIdController
);
giftRoutes.delete("/gifts/:giftId", isAuthenticated, deleteGiftByIdController);