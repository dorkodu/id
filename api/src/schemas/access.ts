import { z } from "zod";
import type { IAccess } from "../../../shared/src/access"
import { sharedSchemas } from "./shared";

export const getAccessesSchema = z.object({
  anchor: sharedSchemas.anchor,
  type: sharedSchemas.type,
}).strict();

export const grantAccessSchema = z.object({
  service: sharedSchemas.service,
}).strict();

export const revokeAccessSchema = z.object({
  accessId: z.number(),
}).strict();


export namespace AccessSchema {
  export type InputGetAccesses = z.infer<typeof getAccessesSchema>
  export type OutputGetAccesses = IAccess[]

  export type InputGrantAccess = z.infer<typeof grantAccessSchema>
  export type OutputGrantAccess = { code: string }

  export type InputRevokeAccess = z.infer<typeof revokeAccessSchema>
  export type OutputRevokeAccess = {}
}