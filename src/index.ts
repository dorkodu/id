import express from "express";

import { config } from "./config";

import authRoutes from "./routes/auth";

async function main() {
  const app = express();
  app.use(express.json());

  app.use("/api/auth", authRoutes);

  app.listen(config.port, () => { console.log(`Server has started on port ${config.port}`) })
}

main();
