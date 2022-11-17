import { z } from "zod";

import { ISession } from "../../../shared/src/session";

export const getCurrentSessionSchema = z.object({}).strict();

export const getSessionsSchema = z.object({
  anchor: z.number(),
  type: z.enum(["newer", "older"])
}).strict();

export const terminateSessionSchema = z.object({
  sessionId: z.number()
}).strict();

export namespace SessionSchema {
  export type InputGetCurrentSession = z.infer<typeof getCurrentSessionSchema>
  export type OutputGetCurrentSession = ISession

  export type InputGetSessions = z.infer<typeof getSessionsSchema>
  export type OutputGetSessions = ISession[]

  export type InputTerminateSession = z.infer<typeof terminateSessionSchema>
  export type OutputTerminateSession = {}
}