import { z } from "zod";
import { sharedSchemas } from "./shared";
import type { IAccess } from "../../../shared/src/access"
import type { IUser } from "../../../shared/src/user";

export const getAccessesSchema = z.object({
  anchor: z.number(),
  type: z.enum(["newer", "older"])
}).strict();

/**
 * Used by the services that use Dorkodu ID as authentication.
 */
export const checkAccessSchema = z.object({
  token: sharedSchemas.token
}).strict();

export const grantAccessSchema = z.object({}).strict();

export const revokeAccessSchema = z.object({
  accessId: z.number()
}).strict();

/**
 * Used by the services that use Dorkodu ID as authentication.
 */
export const getUserDataSchema = z.object({
  token: sharedSchemas.token
}).strict();

export namespace AccessSchema {
  export type InputGetAccesses = z.infer<typeof getAccessesSchema>
  export type OutputGetAccesses = IAccess[]

  export type InputCheckAccess = z.infer<typeof checkAccessSchema>
  export type OutputCheckAccess = { userId: number }

  export type InputGrantAccess = z.infer<typeof grantAccessSchema>
  export type OutputGrantAccess = {}

  export type InputRevokeAccess = z.infer<typeof revokeAccessSchema>
  export type OutputRevokeAccess = {}

  export type InputGetUserData = z.infer<typeof getUserDataSchema>
  export type OutputGetUserData = IUser
}