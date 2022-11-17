import { z } from "zod";

export const getAccessesSchema = z.object({}).strict();

export const checkAccessSchema = z.object({}).strict();

export const grantAccessSchema = z.object({}).strict();

export const revokeAccessSchema = z.object({}).strict();

export namespace AccessSchema {
  export type InputGetAccesses = z.infer<typeof getAccessesSchema>
  export type OutputGetAccesses = {}

  export type InputCheckAccess = z.infer<typeof checkAccessSchema>
  export type OutputCheckAccess = {}

  export type InputGrantAccess = z.infer<typeof grantAccessSchema>
  export type OutputGrantAccess = {}

  export type InputRevokeAccess = z.infer<typeof revokeAccessSchema>
  export type OutputRevokeAccess = {}
}