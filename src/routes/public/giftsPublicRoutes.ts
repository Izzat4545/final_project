import { Router } from "express";
import { getAllGiftsController } from "../../controller/giftsController";
import { getGiftByIdController } from "../../controller/giftsController";
import { giftAccessMiddleware } from "../../middleware/giftAccessMiddleware";
import { isAuthenticatedSoft } from "../../middleware/authMiddlewareSoft";

export const giftsPublicRoutes = Router();

giftsPublicRoutes.get(
  "/gifts/:eventId",
  isAuthenticatedSoft,
  giftAccessMiddleware,
  getAllGiftsController
);

giftsPublicRoutes.get(
  "/gifts/:eventId/:giftId",
  isAuthenticatedSoft,
  giftAccessMiddleware,
  getGiftByIdController
);
