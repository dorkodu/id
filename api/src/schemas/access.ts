import { z } from "zod";
import type { IAccess } from "../../../shared/src/access"

export const getAccessesSchema = z.object({
  anchor: z.number(),
  type: z.enum(["newer", "older"])
}).strict();

export const grantAccessSchema = z.object({}).strict();

export const revokeAccessSchema = z.object({
  accessId: z.number()
}).strict();


export namespace AccessSchema {
  export type InputGetAccesses = z.infer<typeof getAccessesSchema>
  export type OutputGetAccesses = IAccess[]

  export type InputGrantAccess = z.infer<typeof grantAccessSchema>
  export type OutputGrantAccess = {}

  export type InputRevokeAccess = z.infer<typeof revokeAccessSchema>
  export type OutputRevokeAccess = {}
}