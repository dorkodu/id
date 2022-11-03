import { z } from "zod";

import { sharedSchemas } from "./shared";
import { IUser } from "../types/user";

export const getUserSchema = z.object({

}).strict();
export type InputGetUserSchema = z.infer<typeof getUserSchema>
export type OutputGetUserSchema = IUser;

export const changeUsernameSchema = z.object({
  newUsername: sharedSchemas.username,
}).strict();
export type InputChangeUsernameSchema = z.infer<typeof changeUsernameSchema>
export type OutputChangeUsernameSchema = {}

export const changeEmailSchema = z.object({
  newEmail: sharedSchemas.email,
  password: sharedSchemas.password,
}).strict();
export type InputChangeEmailSchema = z.infer<typeof changeEmailSchema>
export type OutputChangeEmailSchema = {}

export const changePasswordSchema = z.object({
  oldPassword: sharedSchemas.password,
  newPassword: sharedSchemas.password,
}).strict();
export type InputChangePasswordSchema = z.infer<typeof changePasswordSchema>
export type OutputChangePasswordSchema = {}
