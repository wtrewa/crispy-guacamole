import mongoose from "mongoose";
import config from "./config";
import logger from "../utils/logger";

export async function connectDatabase() {
  try {
    await mongoose.connect(config.mongodb.uri);
    logger.info("MongoDB Connected");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
  logger.info("MongoDB disconnected");
}
