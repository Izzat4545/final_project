import { NextFunction, Request, Response } from "express";
import { Event } from "../models/eventModel";
import { UserType } from "../types/User";
import { visibilityModes } from "../utils/enums/visibilityModes";

export const giftAccessMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { eventId } = req.params;
  const user = req.user as UserType | undefined;

  try {
    // Fetch the event by eventId
    const event = await Event.findOne({ where: { id: eventId } });

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    const { visibility, userId: eventOwnerId } = event;

    // Access control logic
    if (visibility === visibilityModes.PRIVATE && user?.id !== eventOwnerId) {
      res.status(403).json({ error: "Access denied. This event is private." });
      return;
    }

    // If visibility is public, by_url, or the user owns the event, allow access
    if (
      visibility === visibilityModes.PUBLIC ||
      visibility === visibilityModes.BY_URL ||
      (visibility === visibilityModes.PRIVATE && user?.id === eventOwnerId)
    ) {
      next();
      return;
    }

    // Default case: Access denied for any other scenario
    res.status(403).json({ error: "Access denied" });
  } catch (error) {
    res.status(500).json({
      error: `Failed to validate event access: ${(error as Error).message}`,
    });
  }
};
