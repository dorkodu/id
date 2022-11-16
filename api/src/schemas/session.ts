import { z } from "zod";

import { ISession } from "../../../shared/src/session";

export const getCurrentSessionSchema = z.object({

}).strict();
export type InputGetCurrentSessionSchema = z.infer<typeof getCurrentSessionSchema>
export type OutputGetCurrentSessionSchema = ISession;

export const getSessionsSchema = z.object({
  anchor: z.number(),
  type: z.enum(["newer", "older"])
}).strict();
export type InputGetSessionsSchema = z.infer<typeof getSessionsSchema>
export type OutputGetSessionsSchema = ISession[];

export const terminateSessionSchema = z.object({
  sessionId: z.number()
}).strict();
export type InputTerminateSessionSchema = z.infer<typeof terminateSessionSchema>
export type OutputTerminateSessionSchema = {};