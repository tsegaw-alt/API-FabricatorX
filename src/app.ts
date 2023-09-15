import { rateLimit } from 'express-rate-limit';
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import errorMiddleware from "./middlewares/error.middleware";
import routes from "./routes/index";
import logger from "./utils/logger.util";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "../swaggerConfig";
import { reteLimiter } from "./middlewares/rateLimit.middleware";

export function createAppInstance(): Express {
  const app = express();

  // Middleware
  app.use(reteLimiter);
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cors());
  app.use(helmet());

  // Middleware for logging requests
  app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

  // Swagger setup
  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Routes
  app.use("/api", routes);
  app.get("/", (req, res) => {
    res.redirect("/api/products");
  });

  // Universal route
  app.use((req, res) => {
    res.status(404).send("404 Not Found");
  });

  // Error middleware
  app.use(errorMiddleware);

  return app;
}
