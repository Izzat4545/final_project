import { NextFunction, Request, Response } from "express";
import { logger } from "../config/logger/loggerMain";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { method, url } = req;
  const startTime = Date.now();

  res.on("finish", () => {
    const { statusCode } = res;
    const elapsedTime = Date.now() - startTime;
    const logMessage = `${method} ${url} ${statusCode} - ${elapsedTime}ms`;

    switch (true) {
      case statusCode >= 500:
        logger.error(logMessage);
        break;
      case statusCode >= 400:
        logger.warn(logMessage);
        break;
      default:
        logger.info(logMessage);
        break;
    }
  });
  next();
};
