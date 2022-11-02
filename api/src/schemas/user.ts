import { z } from "zod";

import { sharedSchemas } from "./shared";

export const getUserSchema = z.object({

}).strict();

export const changeUsernameSchema = z.object({
  newUsername: sharedSchemas.username,
}).strict();

export const changeEmailSchema = z.object({
  newEmail: sharedSchemas.email,
  password: sharedSchemas.password,
}).strict();

export const changePasswordSchema = z.object({
  oldPassword: sharedSchemas.password,
  newPassword: sharedSchemas.password,
}).strict();

export const getSessionsSchema = z.object({
  anchor: z.number()
}).strict();

export const terminateSessionSchema = z.object({
  sessionId: z.number()
}).strict();