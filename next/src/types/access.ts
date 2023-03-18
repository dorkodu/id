import { z } from "zod";

export type IAccess = IAccessParsed;
export type IAccessRaw = z.input<typeof iAccessSchema>
export type IAccessParsed = z.output<typeof iAccessSchema>
export const iAccessSchema = z.object({
  id: z.string(),
  createdAt: z.string().transform((arg) => parseInt(arg)),
  expiresAt: z.string().transform((arg) => parseInt(arg)),
  userAgent: z.string(),
  ip: z.string(),
  service: z.string(),
}).strict();