import { z } from "zod";
import { sharedSchemas } from "./_shared";

export const initiateSignupSchema = z.object({
  username: sharedSchemas.username,
  email: sharedSchemas.email,
}).strict();

export const confirmSignupSchema = z.object({
  username: sharedSchemas.username,
  email: sharedSchemas.email,
  password: sharedSchemas.password,
}).strict();

export const loginSchema = z.object({
  info: z.string(),
  password: sharedSchemas.password,
}).strict();