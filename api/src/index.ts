import express from "express";
import cookieParser from "cookie-parser";

import { config } from "./config";

import accessRoutes from "./routes/access";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import sessionRoutes from "./routes/session";

import auth from "./controllers/auth";

async function main() {
  const app = express();

  app.set("trust proxy", true);
  app.use(express.json());
  app.use(cookieParser());

  app.use(accessRoutes);
  app.use(auth.middleware, authRoutes);
  app.use(auth.middleware, userRoutes);
  app.use(auth.middleware, sessionRoutes);

  app.listen(config.port, () => { console.log(`Server has started on port ${config.port}`) });
}

main();