import {
  createGiftReservationController,
  getAllGiftsController,
  getPopularGiftsController,
} from "../../controller/giftsController";
import { Router } from "express";
import { getGiftByIdController } from "../../controller/giftsController";
import { giftAccessMiddleware } from "../../middleware/giftAccessMiddleware";
import { isAuthenticatedSoft } from "../../middleware/authMiddlewareSoft";

export const giftsPublicRoutes = Router();

giftsPublicRoutes.get(
  "/gifts/popular",
  isAuthenticatedSoft,
  getPopularGiftsController
);

giftsPublicRoutes.put(
  "/gifts/reservation/:giftId",
  createGiftReservationController
);

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
