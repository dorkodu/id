import { z } from "zod";

import { sharedSchemas } from "./shared";

export const authSchema = z.object({

}).strict();
export type InputAuthSchema = z.infer<typeof authSchema>
export type OutputAuthSchema = {}

export const initiateSignupSchema = z.object({
  username: sharedSchemas.username,
  email: sharedSchemas.email,
}).strict();
export type InputInitiateSignupSchema = z.infer<typeof initiateSignupSchema>
export type OutputInitiateSignupSchema = {}

export const confirmSignupSchema = z.object({
  username: sharedSchemas.username,
  email: sharedSchemas.email,
  password: sharedSchemas.password,
  otp: z.number(),
}).strict();
export type InputConfirmSignupSchema = z.infer<typeof confirmSignupSchema>
export type OutputConfirmSignupSchema = {}

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