import { Config } from "jest";
import base from "./jest.config";

const config: Config = {
  ...base,
  testRegex: "\\.integration.test\\.(ts)$"
};

export default config;