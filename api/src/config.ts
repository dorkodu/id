import { config as dotenv } from "dotenv";

import * as path from "path";

dotenv({ path: path.join(__dirname, "../.env") });

const postgresHost = process.env.PG_HOST || "oath_postgres";
const postgresPort = (process.env.PG_PORT && parseInt(process.env.PG_PORT)) || 5432;
const postgresName = process.env.PG_NAME || "oath";
const postgresUser = process.env.PG_USER || "postgres";
const postgresPassword = process.env.PG_PASSWORD || "postgres";

const bcryptRounds = (process.env.BCRYPT_ROUNDS && parseInt(process.env.BCRYPT_ROUNDS)) || 10;

const port = 8001;

export const config = {
  postgresHost,
  postgresPort,
  postgresName,
  postgresUser,
  postgresPassword,

  bcryptRounds,

  port,
}