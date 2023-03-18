import { z } from "zod";
import { sharedSchemas } from "./_shared";

export const editProfileSchema = z.object({
  name: sharedSchemas.name,
  username: sharedSchemas.username,
  bio: sharedSchemas.bio,
}).strict();

export const initiateEmailChangeSchema = z.object({
  newEmail: sharedSchemas.email,
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