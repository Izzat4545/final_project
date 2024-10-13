import { NextFunction, Request, Response } from "express";
import { User } from "../models/userModel";
import { UserType } from "../types/User";
import { getEnv } from "../utils/getEnv";
import jwt from "jsonwebtoken";
import { logger } from "../config/logger/loggerMain";

// IT SHOULD BE USER FOR PUBLIC ROUTES
export const isAuthenticatedSoft = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const JWT_SECRET = getEnv("JWT_SECRET");
    const authorizationHeader = req.header("Authorization");

    // If there's no Authorization header, skip authentication
    if (!authorizationHeader) {
      return next();
    }

    const parts = authorizationHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return next();
    }

    const token = parts[1];

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return next(); // Proceed to the next middleware
      }

      const user = decoded as UserType;
      req.user = user;

      const dbUser = await User.findByPk(user.id);
      if (!dbUser) {
        // If the user doesn't exist in the database, proceed
        return next();
      }
      req.user = dbUser;
      next();
    });
  } catch (error) {
    logger.error("Authentication error:", error);
    return next();
  }
};
