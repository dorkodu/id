import { config } from "dotenv";

import * as express from "express";
import * as cookieParser from "cookie-parser";

import * as path from "path";

import { db } from "./db";

import authRoutes from "./routes/auth";

async function main() {
  config({ path: path.join(__dirname, "../.env") })
  db.init();

  const app = express();

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  // Routes
  app.use("/api/auth", authRoutes);

  // Catch all other routes and send index.html
  app.get("*", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
  })

  const port = (process.env.PORT !== undefined && parseInt(process.env.PORT)) || 80;
  app.listen(port, () => { console.log(`Server has started on port ${port}`) })
}

main();