import { config as dotenv } from "dotenv";

import * as path from "path";

dotenv({ path: path.join(__dirname, "../../.env") });

const postgresHost = process.env.POSTGRES_HOST || "id_postgres";
const postgresPort = (process.env.PGPORT && parseInt(process.env.PGPORT)) || 5432;
const postgresName = process.env.POSTGRES_DB || "id";
const postgresUser = process.env.POSTGRES_USER || "postgres";
const postgresPassword = process.env.POSTGRES_PASSWORD || "postgres";

const smtpHost = process.env.SMTP_HOST || "id_mailslurper";
const smtpPort = (process.env.SMTP_PORT && parseInt(process.env.SMTP_PORT)) || 2500;
const smtpUser = process.env.SMTP_USER || "";;
const smtpPassword = process.env.SMTP_PASSWORD || "";;

const bcryptRounds = (process.env.BCRYPT_ROUNDS && parseInt(process.env.BCRYPT_ROUNDS)) || 10;

const port = (process.env.PORT && parseInt(process.env.PORT)) || 8001;
const env = process.env.NODE_ENV || "development";

const serviceWhitelist = (process.env.SERVICE_WHITELIST && process.env.SERVICE_WHITELIST.split(" ")) || [
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