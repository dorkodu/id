import { z } from "zod";
import { sharedSchemas } from "./_shared";

export const getAccessTokenSchema = z.object({
  code: sharedSchemas.code,
}).strict();

export const expireAccessTokenSchema = z.object({
  token: sharedSchemas.token,
}).strict();

export const checkAccessSchema = z.object({
  token: sharedSchemas.token,
}).strict();

export const getUserDataSchema = z.object({
  token: sharedSchemas.token,
}).strict();