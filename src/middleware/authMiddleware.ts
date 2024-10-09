import { NextFunction, Request, Response } from "express";
import { UserType } from "../types/User";
import { getEnv } from "../utils/getEnv";
import jwt from "jsonwebtoken";
import { logger } from "../config/logger/loggerMain";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const JWT_SECRET = getEnv("JWT_SECRET");
    const authorizationHeader = req.header("Authorization");

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Invalid authorization header",
      });
      return;
    }

    const token = authorizationHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Please provide the token",
      });
      return;
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        logger.error("Token verification error:", err);
        res.status(401).json({
          success: false,
          message: "Invalid token",
        });
        return;
      }

      const user = decoded as UserType;
      req.user = user;
      next();
    });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    return;
  }
};
