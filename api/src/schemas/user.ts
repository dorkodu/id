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

export const initiateChangeEmailSchema = z.object({
  newEmail: sharedSchemas.email
}).strict();
export type InputInitiateChangeEmailSchema = z.infer<typeof initiateChangeEmailSchema>
export type OutputInitiateChangeEmailSchema = {}

export const verifyNewEmailChangeEmailSchema = z.object({}).strict();
export type InputVerifyNewEmailChangeEmailSchema = z.infer<typeof verifyNewEmailChangeEmailSchema>
export type OutputVerifyNewEmailChangeEmailSchema = {}

export const verifyOldEmailChangeEmailSchema = z.object({}).strict();
export type InputVerifyOldEmailChangeEmailSchema = z.infer<typeof verifyOldEmailChangeEmailSchema>
export type OutputVerifyOldEmailChangeEmailSchema = {}

export const initiateChangePasswordSchema = z.object({}).strict();
export type InputInitiateChangePasswordSchema = z.infer<typeof initiateChangePasswordSchema>
export type OutputInitiateChangePasswordSchema = {}

export const proceedChangePasswordSchema = z.object({}).strict();
export type InputProceedChangePasswordSchema = z.infer<typeof proceedChangePasswordSchema>
export type OutputProceedChangePasswordSchema = {}

export const completeChangePasswordSchema = z.object({
  newPassword: sharedSchemas.password
}).strict();
export type InputCompleteChangePasswordSchema = z.infer<typeof completeChangePasswordSchema>
export type OutputCompleteChangePasswordSchema = {}
