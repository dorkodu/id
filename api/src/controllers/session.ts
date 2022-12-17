import { ISession } from "../../../shared/src/session";
import { date } from "../lib/date";
import pg from "../pg";
import { getSessionsSchema, terminateSessionSchema } from "../schemas/session";
import auth from "./auth";
import sage from "@dorkodu/sage-server";
import { SchemaContext } from "./_schema";
import { z } from "zod";

const getCurrentSession = sage.resource(
  {} as SchemaContext,
  undefined,
  async (_arg, ctx) => {
    const info = await auth.getAuthInfo(ctx);
    if (!info) return undefined;

    const [result]: [ISession?] = await pg`
      SELECT id, created_at, expires_at, user_agent, ip FROM sessions WHERE id=${info.tokenId}
    `;
    if (!result) return undefined;

    return result;
  }
)

const getSessions = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof getSessionsSchema>,
  async (arg, ctx) => {
    const parsed = getSessionsSchema.safeParse(arg);
    if (!parsed.success) return undefined;

    const info = await auth.getAuthInfo(ctx);
    if (!info) return undefined;

    const { anchor, type } = parsed.data;
    const result = await pg<ISession[]>`
      SELECT id, created_at, expires_at, user_agent, ip FROM sessions
      WHERE user_id=${info.userId} AND expires_at>${date.utc()}
      ${anchor === -1 ? pg`` : type === "newer" ? pg`AND id>${anchor}` : pg`AND id<${anchor}`}
      ORDER BY id ${anchor === -1 ? pg`DESC` : type === "newer" ? pg`ASC` : pg`DESC`}
      LIMIT 10
    `;
    if (!result.length) return undefined;

    return result as ISession[];
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

    await pg`UPDATE sessions SET expires_at=${date.utc()} WHERE id=${sessionId} AND user_id=${info.userId}`;

    return {};
  }
)

export default {
  getCurrentSession,
  getSessions,
  terminateSession,
}