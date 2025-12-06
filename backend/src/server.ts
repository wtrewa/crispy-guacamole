// src/server.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';

import config from './config/config';
import logger from './utils/logger';
import { connectDatabase, disconnectDatabase } from './config/database';
import errorHandler from './middleware/errorHandler';
import routes from './routes';

class Server {
  public app: Application;
  private server: any;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

 private initializeMiddlewares(): void {
  /** ---------------------------------------
   * 1. Security headers (Helmet)
   * -------------------------------------- */
  this.app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    })
  );

  /** ---------------------------------------
   * 2. CORS
   * MUST COME AFTER helmet AND BEFORE body parser
   * -------------------------------------- */
  const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
      const whitelist = config.corsOrigins; // ADD YOUR FRONTEND URL HERE
      if (!origin || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  };
  this.app.use(cors(corsOptions));

  /** ---------------------------------------
   * 3. Body Parser (VERY IMPORTANT)
   * mongoSanitize MUST come AFTER this
   * --------------------------------------*/
  this.app.use(express.json({ limit: "10mb" }));
  this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  /** ---------------------------------------
   * 4. Sanitizers (AFTER body parser)
   * -------------------------------------- */
  // this.app.use(mongoSanitize()); // NOW SAFE — DOES NOT REMOVE BODY
  this.app.use(hpp());

  /** ---------------------------------------
   * 5. Cookies, compression, logging
   * -------------------------------------- */
  this.app.use(cookieParser());
  this.app.use(compression());

  if (config.env === "development") {
    this.app.use(morgan("dev"));
  } else {
    this.app.use(
      morgan("combined", {
        stream: { write: (message: string) => logger.info(message.trim()) },
      })
    );
  }

  /** ---------------------------------------
   * 6. Rate limiting (Optional)
   * -------------------------------------- */
  const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  });
  this.app.use("/api/", limiter);

  /** ---------------------------------------
   * 7. Static files
   * -------------------------------------- */
  this.app.use(express.static(path.join(__dirname, "../public")));

  /** ---------------------------------------
   * 8. Request Logger
   * -------------------------------------- */
  this.app.use(this.requestLogger);
}


  private requestLogger = (req: Request, res: Response, next: NextFunction): void => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.info({
        method: req.method,
        url: req.url,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip
      });
    });
    
    next();
  };

  private initializeRoutes(): void {
    // Health check
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.env
      });
    });

    // API routes
    this.app.use('/api/v1', routes);

    // Root route
    this.app.get('/', (req: Request, res: Response) => {
      res.json({
        message: 'Welcome to the API',
        version: config.api.version,
        endpoints: {
          health: '/health',
          api: '/api/v1'
        }
      });
    });

    // 404 handler
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Connect to database
      await connectDatabase();
      logger.info('Database connected successfully');

      // Start server
      const PORT = config.port;
      this.server = this.app.listen(PORT, () => {
        logger.info(`Server running in ${config.env} mode on port ${PORT}`);
      });

      // Graceful shutdown handlers
      process.on('SIGTERM', () => this.gracefulShutdown('SIGTERM'));
      process.on('SIGINT', () => this.gracefulShutdown('SIGINT'));

      // Handle unhandled promise rejections
      process.on('unhandledRejection', (err: Error) => {
        logger.error('Unhandled Rejection:', err);
        this.gracefulShutdown('UNHANDLED_REJECTION');
      });

    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  private async gracefulShutdown(signal: string): Promise<void> {
    logger.info(`${signal} received, starting graceful shutdown`);

    if (this.server) {
      this.server.close(async () => {
        logger.info('HTTP server closed');

        try {
          await disconnectDatabase();
          logger.info('Database disconnected');
          process.exit(0);
        } catch (err) {
          logger.error('Error during shutdown:', err);
          process.exit(1);
        }
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    }
  }
}

// Start server
const server = new Server();
server.start();

export default server.app;