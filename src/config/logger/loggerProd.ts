import { createLogger, format, transports } from "winston";
import { AppModes } from "../../utils/enums/appModes";
import path from "path";

const { combine, timestamp, label, printf } = format;

// Custom log format
const myFormat = printf(
  ({ level, message, label, timestamp }) =>
    `${timestamp} ${label} [${level}]: ${message}`
);
const DEFAULT_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

export const productionLogger = () => {
  return createLogger({
    level: "info",
    format: combine(
      label({ label: AppModes.PRODUCTION }),
      timestamp({ format: DEFAULT_TIME_FORMAT }),
      myFormat
    ),
    transports: [
      // Error logs will go to error.log
      new transports.File({
        filename: path.join(__dirname, "../../../logs/error.log"),
        level: "error",
      }),
      new transports.File({
        filename: path.join(__dirname, "../../../logs/combined.log"),
      }),
    ],
  });
};
