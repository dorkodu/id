import type { Config } from 'jest';

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePaths: ["<rootDir>/src/test"],
  testRegex: "\\.test\\.(ts)$",
  moduleFileExtensions: ["ts", "js"],
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
  }
};

export default config;