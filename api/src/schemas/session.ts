import { z } from "zod";

export const getCurrentSessionSchema = z.object({

}).strict();

export const getSessionsSchema = z.object({
  anchor: z.number()
}).strict();

export const terminateSessionSchema = z.object({
  sessionId: z.number()
}).strict();