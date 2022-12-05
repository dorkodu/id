import { z } from "zod";
import { IUser } from "../../../shared/src/user";
import { sharedSchemas } from "./shared";

export const getAccessTokenSchema = z.object({
  code: sharedSchemas.code,
}).strict();

export const checkAccessSchema = z.object({
  token: sharedSchemas.token,
}).strict();

export const getUserDataSchema = z.object({
  token: sharedSchemas.token,
}).strict();

export namespace ExternalSchema {
  export type InputGetAccessToken = z.infer<typeof getAccessTokenSchema>
  export type OutputGetAccessToken = { token: string }

  export type InputCheckAccess = z.infer<typeof checkAccessSchema>
  export type OutputCheckAccess = { userId: number }

  export type InputGetUserData = z.infer<typeof getUserDataSchema>
  export type OutputGetUserData = IUser
}