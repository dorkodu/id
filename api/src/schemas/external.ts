import { z } from "zod";
import { IUser } from "../../../shared/src/user";
import { sharedSchemas } from "./shared";

/**
 * Used by the services that use Dorkodu ID as authentication.
 */
export const checkAccessSchema = z.object({
  token: sharedSchemas.token
}).strict();

/**
 * Used by the services that use Dorkodu ID as authentication.
 */
export const getUserDataSchema = z.object({
  token: sharedSchemas.token
}).strict();

export namespace ExternalSchema {
  export type InputCheckAccess = z.infer<typeof checkAccessSchema>
  export type OutputCheckAccess = { userId: number }

  export type InputGetUserData = z.infer<typeof getUserDataSchema>
  export type OutputGetUserData = IUser
}