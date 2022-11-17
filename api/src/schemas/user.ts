import { z } from "zod";

import { sharedSchemas } from "./shared";
import { IUser } from "../../../shared/src/user";

export const getUserSchema = z.object({}).strict();

export const changeUsernameSchema = z.object({
  newUsername: sharedSchemas.username,
}).strict();

export const initiateEmailChangeSchema = z.object({
  newEmail: sharedSchemas.email
}).strict();

export const confirmEmailChangeSchema = z.object({
  token: sharedSchemas.token,
}).strict();

export const revertEmailChangeSchema = z.object({
  token: sharedSchemas.token,
}).strict();

export const initiatePasswordChangeSchema = z.object({
  username: sharedSchemas.username,
  email: sharedSchemas.email,
}).strict();

export const confirmPasswordChangeSchema = z.object({
  newPassword: sharedSchemas.password,
  token: sharedSchemas.token,
}).strict();

export namespace UserSchema {
  export type InputGetUser = z.infer<typeof getUserSchema>
  export type OutputGetUser = IUser

  export type InputChangeUsername = z.infer<typeof changeUsernameSchema>
  export type OutputChangeUsername = {}

  export type InputInitiateEmailChange = z.infer<typeof initiateEmailChangeSchema>
  export type OutputInitiateEmailChange = {}

  export type InputConfirmEmailChange = z.infer<typeof confirmEmailChangeSchema>
  export type OutputConfirmEmailChange = {}

  export type InputRevertEmailChange = z.infer<typeof revertEmailChangeSchema>
  export type OutputRevertEmailChange = {}

  export type InputInitiatePasswordChange = z.infer<typeof initiatePasswordChangeSchema>
  export type OutputInitiatePasswordChange = {}

  export type InputConfirmPasswordChange = z.infer<typeof confirmPasswordChangeSchema>
  export type OutputConfirmPasswordChange = {}
}