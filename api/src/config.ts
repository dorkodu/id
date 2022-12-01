import { config as dotenv } from "dotenv";

import * as path from "path";

dotenv({ path: path.join(__dirname, "../.env") });

const postgresHost = process.env.PG_HOST || "id_postgres";
const postgresPort = (process.env.PG_PORT && parseInt(process.env.PG_PORT)) || 5432;
const postgresName = process.env.PG_NAME || "id";
const postgresUser = process.env.PG_USER || "postgres";
const postgresPassword = process.env.PG_PASSWORD || "postgres";

const smtpHost = process.env.SMTP_HOST || "id_mailslurper";
const smtpPort = (process.env.SMTP_PORT && parseInt(process.env.SMTP_PORT)) || 2500;
const smtpUser = process.env.SMTP_USER || "";;
const smtpPassword = process.env.SMTP_PASSWORD || "";;

const bcryptRounds = (process.env.BCRYPT_ROUNDS && parseInt(process.env.BCRYPT_ROUNDS)) || 10;

const port = 8001;
const env = process.env.NODE_ENV || "development";

const serviceWhitelist = [
  "wander.dorkodu.com",
  "trekie.dorkodu.com",
];

export const config = {
  postgresHost,
  postgresPort,
  postgresName,
  postgresUser,
  postgresPassword,

  smtpHost,
  smtpPort,
  smtpUser,
  smtpPassword,

  bcryptRounds,

  port,
  env,

  serviceWhitelist,
}