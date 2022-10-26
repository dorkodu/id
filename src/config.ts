import { config as dotenv } from "dotenv";

import path from "path";

dotenv({ path: path.join(__dirname, "../.env") });

const databaseHost = process.env.DB_HOST || "";
const databaseName = process.env.DB_NAME || "";
const databasePort = (process.env.DB_PORT && parseInt(process.env.DB_PORT)) || 5432;
const databaseUser = process.env.DB_USER || "";
const databasePassword = process.env.DB_PASSWORD || "";

const bcryptRounds = (process.env.BCRYPT_ROUNDS && parseInt(process.env.BCRYPT_ROUNDS)) || 10;

const port = (process.env.PORT && parseInt(process.env.PORT)) || 80;

export const config = {
  databaseHost,
  databaseName,
  databasePort,
  databaseUser,
  databasePassword,

  bcryptRounds,

  port,
}