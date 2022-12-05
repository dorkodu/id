import { z } from "zod";

import { sharedSchemas } from "./shared";

export const authSchema = z.object({}).strict();

export const initiateSignupSchema = z.object({
  username: sharedSchemas.username,
  email: sharedSchemas.email,
}).strict();

export const confirmSignupSchema = z.object({
  username: sharedSchemas.username,
  email: sharedSchemas.email,
  password: sharedSchemas.password,
  otp: sharedSchemas.otp,
}).strict();

export const loginSchema = z.object({
  info: z.string(),
  password: sharedSchemas.password,
}).strict();

export const logoutSchema = z.object({}).strict();

export namespace AuthSchema {
  export type InputAuth = z.infer<typeof authSchema>
  export type OutputAuth = {}

  export type InputInitiateSignup = z.infer<typeof initiateSignupSchema>
  export type OutputInitiateSignup = {}

  export type InputConfirmSignup = z.infer<typeof confirmSignupSchema>
  export type OutputConfirmSignup = {}

  export type InputLogin = z.infer<typeof loginSchema>
  export type OutputLogin = {}

  export type InputLogout = z.infer<typeof logoutSchema>
  export type OutputLogout = {}
}