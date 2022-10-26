import { config as dotenv } from "dotenv";

import * as path from "path";

dotenv({ path: path.join(__dirname, "../.env") });

const databaseHost = process.env.DB_HOST || "";
const databaseName = process.env.DB_NAME || "";
const databasePort = (process.env.DB_PORT && parseInt(process.env.DB_PORT)) || 3306;
const databaseUser = process.env.DB_USER || "";
const databasePassword = process.env.DB_PASSWORD || "";

const port = (process.env.PORT && parseInt(process.env.PORT)) || 80;

export const config = {
  databaseHost,
  databaseName,
  databasePort,
  databaseUser,
  databasePassword,
  
  port,
}