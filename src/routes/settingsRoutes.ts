import { Router } from "express";
import { isAuthenticated } from "../middleware/authMiddleware";
import { settingsController } from "../controller/settingsControllers";
import { validateSettings } from "../middleware/validators/settingsValidation";

export const settinsRoutes = Router();

settinsRoutes.post(
  "/settings",
  isAuthenticated,
  validateSettings,
  settingsController
);
