import { config } from "dotenv";

import { fastify } from "fastify";
import { fastifyCookie } from "@fastify/cookie";
import { fastifyStatic } from "@fastify/static";
import * as path from "path";

import { Api } from "./api";

async function main() {
  config();

  const server = fastify();
  server.register(fastifyCookie);
  server.register(fastifyStatic, { root: path.join(__dirname, "./dist") });

  server.post("/api", (req, res) => {
    Api.handle(req, res);
  });

  server.listen(process.env.PORT && parseInt(process.env.PORT) || 80, (err, addr) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    console.log(`Server has started on ${addr}`);
  });
}

main();