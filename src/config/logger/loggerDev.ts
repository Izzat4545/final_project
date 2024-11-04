import { createLogger, format, transports } from "winston";
import { AppModes } from "../../utils/enums/appModes";

const { combine, timestamp, label, printf } = format;

const myFormat = printf(
  ({ level, message, label, timestamp }) =>
    `${timestamp} ${label} [${level}]: ${message}`
);
const DEFAULT_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

export const devLogger = () => {
  return createLogger({
    level: "debug",
    format: combine(
      format.colorize(),
      label({ label: AppModes.DEVELOPMENT }),
      timestamp({ format: DEFAULT_TIME_FORMAT }),
      myFormat
    ),
    transports: [new transports.Console()],
  });
};
