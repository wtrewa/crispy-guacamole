import { createLogger, format, transports } from "winston";
import config from "../config/config";

const logger = createLogger({
  level: config.logger.level,
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.Console({
      format:
        config.env === "development"
          ? format.combine(format.colorize(), format.simple())
          : format.json()
    })
  ]
});

export default logger;
