import { z } from "zod";
import { sharedSchemas } from "./_shared";

export const getAccessesSchema = z.object({
  anchor: sharedSchemas.anchor,
  type: sharedSchemas.type,
}).strict();

export const grantAccessSchema = z.object({
  service: sharedSchemas.service,
}).strict();

export const revokeAccessSchema = z.object({
  accessId: z.string(),
}).strict();