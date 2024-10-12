import { NextFunction, Request, Response } from "express";
import { User } from "../models/userModel";
import { UserType } from "../types/User";
import { getEnv } from "../utils/getEnv";
import jwt from "jsonwebtoken";

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

    // Ensure the Authorization header is properly formatted as "Bearer <token>"
    const parts = authorizationHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      // Log a message for invalid format but proceed (soft check)
      console.log("Invalid authorization header format");
      return next(); // Do not block public routes for malformed Authorization header
    }

    const token = parts[1];

    // Verify the token
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        // Log token verification errors and proceed (don't block access)
        console.error("Token verification error:", err);
        return next(); // Proceed to the next middleware
      }

      const user = decoded as UserType;
      req.user = user;

      // Fetch the user from the database
      const dbUser = await User.findByPk(user.id);
      if (!dbUser) {
        // If the user doesn't exist in the database, proceed
        return next();
      }

      // Attach the authenticated user to the request object
      req.user = dbUser;
      next(); // Proceed to the next middleware
    });
  } catch (error) {
    console.error("Authentication error:", error);
    // Do not stop the request, simply allow the request to proceed (public route)
    return next();
  }
};
