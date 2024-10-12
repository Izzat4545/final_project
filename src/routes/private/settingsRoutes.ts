import { Router } from "express";
import { settingsController } from "../../controller/settingsControllers";
import { validateSettings } from "../../middleware/validators/settingsValidation";

export const settinsRoutes = Router();

settinsRoutes.post("/settings", validateSettings, settingsController);
