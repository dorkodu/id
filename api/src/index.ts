import express from "express";
import cookieParser from "cookie-parser";

import { config } from "./config";

import keydb from "./keydb";
import { router } from "./controllers/_router";

async function main() {
  const app = express();
  await keydb.connect();

  app.set("trust proxy", true);
  app.use(express.json());
  app.use(cookieParser());

  app.use("/api", async (req, res, next) => {
    res.status(200).send(await router.handle(() => ({ req, res, next }), req.body));
  });

  app.listen(config.port, () => { console.log(`Server has started on port ${config.port}`) });
}

main();