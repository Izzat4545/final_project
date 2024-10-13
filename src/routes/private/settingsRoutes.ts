import {
  settingsGetController,
  settingsUpdateController,
} from "../../controller/settingsControllers";
import { Router } from "express";
import { isAuthenticated } from "../../middleware/authMiddleware";
import { validateSettings } from "../../middleware/validators/settingsValidation";

export const settinsRoutes = Router();

settinsRoutes.put(
  "/settings",
  isAuthenticated,
  validateSettings,
  settingsUpdateController
);
settinsRoutes.get("/settings", isAuthenticated, settingsGetController);
