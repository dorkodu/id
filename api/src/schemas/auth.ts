import { z } from "zod";

import { sharedSchemas } from "./shared";

export const authSchema = z.object({

}).strict();

export const signupSchema = z.object({
  username: sharedSchemas.username,
  email: sharedSchemas.email,
  password: sharedSchemas.password,
}).strict();

export const loginSchema = z.object({
  info: z.string(),
  password: sharedSchemas.password,
}).strict();

export const logoutSchema = z.object({

}).strict();