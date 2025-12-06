# moon-knight
its node js project.



ypescript-express-server/
│
├── src/
│   ├── config/
│   │   ├── config.ts              # Configuration settings
│   │   └── database.ts            # Database connection
│   │
│   ├── controllers/
│   │   ├── authController.ts      # Authentication logic
│   │   └── userController.ts      # User CRUD operations
│   │
│   ├── middleware/
│   │   ├── auth.ts                # Authentication middleware
│   │   ├── errorHandler.ts        # Error handling
│   │   └── validate.ts            # Request validation
│   │
│   ├── models/
│   │   └── User.ts                # User model
│   │
│   ├── routes/
│   │   ├── index.ts               # Main router
│   │   ├── authRoutes.ts          # Auth routes
│   │   └── userRoutes.ts          # User routes
│   │
│   ├── services/
│   │   └── emailService.ts        # Email service
│   │
│   ├── utils/
│   │   ├── apiFeatures.ts         # API query features
│   │   └── logger.ts              # Winston logger
│   │
│   └── server.ts                  # Main server file
│
├── dist/                          # Compiled JavaScript (generated)
├── logs/                          # Log files
├── public/                        # Static files
├── node_modules/                  # Dependencies
│
├── .env                           # Environment variables (not in git)
├── .env.example                   # Example environment variables
├── .gitignore                     # Git ignore file
├── package.json                   # Package configuration
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # Project documentation

# ============================================
# SETUP INSTRUCTIONS
# ============================================

# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env

# 3. Edit .env with your configuration
nano .env

# 4. Run in development mode
npm run dev

# 5. Build for production
npm run build

# 6. Run production server
npm start

# ============================================
# ADDITIONAL SCRIPTS
# ============================================

# Run tests
npm test

# Lint code
npm run lint

# Fix lint issues



/src
  /config
    index.ts
  /loaders
    logger.ts
    express.ts
    sequelize.ts
  /db
    index.ts            // sequelize instance + init models
    migrations/
    seeders/
  /models
    index.ts
    user.model.ts
    product.model.ts
    productImage.model.ts
  /controllers
    auth.controller.ts
    product.controller.ts
  /services
    auth.service.ts
    product.service.ts
    file.service.ts
  /repositories (optional)
    user.repo.ts
  /routes
    index.ts
    auth.routes.ts
    product.routes.ts
  /middlewares
    error.middleware.ts
    auth.middleware.ts
    validate.middleware.ts
    requestLogger.middleware.ts
  /utils
    jwt.ts
    response.ts
    pagination.ts
  /types
    express.d.ts
  server.ts
  app.ts
/tests
  unit/
  integration/
.env
Dockerfile
docker-compose.yml
tsconfig.json
package.json
