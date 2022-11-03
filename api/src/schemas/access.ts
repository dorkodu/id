import { z } from "zod";

export const getAccessesSchema = z.object({

}).strict();
export type InputGetAccessesSchema = z.infer<typeof getAccessesSchema>
export type OutputGetAccessesSchema = {}

export const checkAccessSchema = z.object({

}).strict();
export type InputCheckAccessSchema = z.infer<typeof checkAccessSchema>
export type OutputCheckAccessSchema = {}

export const grantAccessSchema = z.object({

}).strict();
export type InputGrantAccessSchema = z.infer<typeof grantAccessSchema>
export type OutputGrantAccessSchema = {}

export const revokeAccessSchema = z.object({

}).strict();
export type InputRevokeAccessSchema = z.infer<typeof revokeAccessSchema>
export type OutputRevokeAccessSchema = {}