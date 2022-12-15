import { ISession } from "../../../shared/src/session";
import { date } from "../lib/date";
import pg from "../pg";
import { getSessionsSchema, terminateSessionSchema } from "../schemas/session";
import auth from "./auth";
import sage from "@dorkodu/sage-server";
import { RouterContext } from "./_router";
import { z } from "zod";

const getCurrentSession = sage.route(
  {} as RouterContext,
  undefined,
  async (_input, ctx) => {
    const info = await auth.getAuthInfo(ctx);
    if (!info) return undefined;

    const [result]: [ISession?] = await pg`
      SELECT id, created_at, expires_at, user_agent, ip FROM sessions WHERE id=${info.tokenId}
    `;
    if (!result) return undefined;

    return result;
  }
)

const getSessions = sage.route(
  {} as RouterContext,
  {} as z.infer<typeof getSessionsSchema>,
  async (input, ctx) => {
    const parsed = getSessionsSchema.safeParse(input);
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

    return result;
  }
)

const terminateSession = sage.route(
  {} as RouterContext,
  {} as z.infer<typeof terminateSessionSchema>,
  async (input, ctx) => {
    const parsed = terminateSessionSchema.safeParse(input);
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