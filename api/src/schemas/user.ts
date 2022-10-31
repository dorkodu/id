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

export const ChangePasswordSchema = z.object({
  oldPassword: sharedSchemas.password,
  newPassword: sharedSchemas.password,
}).strict();