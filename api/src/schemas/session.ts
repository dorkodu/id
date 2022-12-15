import { z } from "zod";
import { sharedSchemas } from "./shared";

export const getSessionsSchema = z.object({
  anchor: sharedSchemas.anchor,
  type: sharedSchemas.type
}).strict();

export const terminateSessionSchema = z.object({
  sessionId: z.number()
}).strict();