import { getSessionsSchema, terminateSessionSchema } from "../schemas/session";
import sage from "@dorkodu/sage-server";
import { SchemaContext } from "./_schema";
import { z } from "zod";
import auth from "./auth";
import pg from "../pg";
import { ISessionRaw, iSessionSchema } from "../types/session";
import { date } from "../lib/date";

const getCurrentSession = sage.resource(
  {} as SchemaContext,
  undefined,
  async (_arg, ctx) => {
    const info = await auth.getAuthInfo(ctx);
    if (!info) return undefined;

    const [result]: [ISessionRaw?] = await pg`
      SELECT id, created_at, expires_at, user_agent, ip FROM sessions WHERE id=${info.sessionId}
    `;
    const parsed = iSessionSchema.safeParse(result);
    if (!parsed.success) return undefined;

    return parsed.data;
  }
)

const getSessions = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof getSessionsSchema>,
  async (_arg, _ctx) => {
    return undefined;
  }
)

const terminateSession = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof terminateSessionSchema>,
  async (arg, ctx) => {
    const parsed = terminateSessionSchema.safeParse(arg);
    if (!parsed.success) return undefined;

    const info = await auth.getAuthInfo(ctx);
    if (!info) return undefined;

    const { sessionId } = parsed.data;

    const result = await pg`
      UPDATE sessions SET expires_at=${date.utc()} 
      WHERE id=${sessionId} AND user_id=${info.userId}
    `;
    if (result.count === 0) return undefined;

    return {};
  }
)

export default {
  getCurrentSession,
  getSessions,
  terminateSession,
}