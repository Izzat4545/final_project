import { Router } from "express";
import { isAuthenticated } from "../middleware/authMiddleware";
import { settingsController } from "../controller/settingsControllers";

export const settinsRoutes = Router();

settinsRoutes.post("/settings", isAuthenticated, settingsController);
