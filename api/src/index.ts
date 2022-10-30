import express from "express";
import cookieParser from "cookie-parser";

import { config } from "./config";

async function main() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

  app.listen(config.port, () => { console.log(`Server has started on port ${config.port}`) })
}

main();