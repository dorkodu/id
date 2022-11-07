import { z } from "zod";

import { sharedSchemas } from "./shared";
import { IUser } from "../types/user";

export const getUserSchema = z.object({}).strict();
export type InputGetUserSchema = z.infer<typeof getUserSchema>
export type OutputGetUserSchema = IUser;

export const changeUsernameSchema = z.object({
  newUsername: sharedSchemas.username,
}).strict();
export type InputChangeUsernameSchema = z.infer<typeof changeUsernameSchema>
export type OutputChangeUsernameSchema = {}

export const initiateEmailChangeSchema = z.object({
  newEmail: sharedSchemas.email
}).strict();
export type InputInitiateEmailChangeSchema = z.infer<typeof initiateEmailChangeSchema>
export type OutputInitiateEmailChangeSchema = {}

export const confirmEmailChangeSchema = z.object({
  token: sharedSchemas.token,
}).strict();
export type InputConfirmEmailChangeSchema = z.infer<typeof confirmEmailChangeSchema>
export type OutputConfirmEmailChangeSchema = {}

export const revertEmailChangeSchema = z.object({
  token: sharedSchemas.token,
}).strict();
export type InputRevertEmailChangeSchema = z.infer<typeof revertEmailChangeSchema>
export type OutputRevertEmailChangeSchema = {}

export const initiatePasswordChangeSchema = z.object({
  username: sharedSchemas.username,
  email: sharedSchemas.email,
}).strict();
export type InputInitiatePasswordChangeSchema = z.infer<typeof initiatePasswordChangeSchema>
export type OutputInitiatePasswordChangeSchema = {}

export const confirmPasswordChangeSchema = z.object({
  newPassword: sharedSchemas.password,
  token: sharedSchemas.token,
}).strict();
export type InputConfirmPasswordChangeSchema = z.infer<typeof confirmPasswordChangeSchema>
export type OutputConfirmPasswordChangeSchema = {}
