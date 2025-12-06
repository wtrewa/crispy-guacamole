import dotenv from 'dotenv';
dotenv.config();

const config = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 4000,
  mongodb: {
    uri: process.env.MONGODB_URI || "mongodb+srv://saurabh:saurabh@cluster0.fa9z1yv.mongodb.net/workflow?appName=Cluster0",
  },
  corsOrigins: (process.env.CORS_ORIGINS || "http://localhost:3000")
    .split(",")
    .map(o => o.trim()),
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
    max: Number(process.env.RATE_LIMIT_MAX) || 100
  },
  api: {
    version: "1.0.0"
  },
  logger: {
    level: process.env.LOG_LEVEL || "debug"
  }
};

export default config;
