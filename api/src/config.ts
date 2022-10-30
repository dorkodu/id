import { config as dotenv } from "dotenv";

import * as path from "path";

dotenv({ path: path.join(__dirname, "../.env") });

const port = 8001;

export const config = {
  port,
}