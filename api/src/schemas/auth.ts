import { z } from "zod";

import { sharedSchemas } from "./shared";

export const authSchema = z.object({

}).strict();
export type InputAuthSchema = z.infer<typeof authSchema>
export type OutputAuthSchema = {}

export const signupSchema = z.object({
  username: sharedSchemas.username,
  email: sharedSchemas.email,
  password: sharedSchemas.password,
}).strict();
export type InputSignupSchema = z.infer<typeof signupSchema>
export type OutputSignupSchema = {}

export const loginSchema = z.object({
  info: z.string(),
  password: sharedSchemas.password,
}).strict();
export type InputLoginSchema = z.infer<typeof loginSchema>
export type OutputLoginSchema = {}

export const logoutSchema = z.object({

}).strict();
export type InputLogoutSchema = z.infer<typeof logoutSchema>
export type OutputLogoutSchema = {}