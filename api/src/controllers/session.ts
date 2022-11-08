import { Request, Response } from "express";
import { date } from "../lib/date";
import pg from "../pg";
import { getCurrentSessionSchema, getSessionsSchema, OutputGetCurrentSessionSchema, OutputGetSessionsSchema, OutputTerminateSessionSchema, terminateSessionSchema } from "../schemas/session";
import { ISession } from "../types/session";
import auth from "./auth";

async function getCurrentSession(req: Request, res: Response<OutputGetCurrentSessionSchema>) {
  const parsed = getCurrentSessionSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const info = auth.getAuthInfo(res);
  if (!info) return void res.status(500).send();

  const [result]: [ISession?] = await pg`
    SELECT id, created_at, expires_at, user_agent, ip FROM sessions WHERE id=${info.tokenId}
  `;
  if (!result) return void res.status(500).send();

  return void res.status(200).send(result);
}

async function getSessions(req: Request, res: Response<OutputGetSessionsSchema>) {
  const parsed = getSessionsSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const info = auth.getAuthInfo(res);
  if (!info) return void res.status(500).send();

  const { anchor, type } = parsed.data;
  const result = await pg<ISession[]>`
    SELECT id, created_at, expires_at, user_agent, ip FROM sessions
    WHERE user_id=${info.userId} AND expires_at>${date.utc()}
    ${anchor === -1 ? pg`` : type === "newer" ? pg`AND id>${anchor}` : pg`AND id<${anchor}`}
    ORDER BY id ${anchor === -1 ? pg`DESC` : type === "newer" ? pg`ASC` : pg`DESC`}
    LIMIT 10
  `;
  if (!result.length) return void res.status(500).send();

  return void res.status(200).send(result);
}

async function terminateSession(req: Request, res: Response<OutputTerminateSessionSchema>) {
  const parsed = terminateSessionSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const info = auth.getAuthInfo(res);
  if (!info) return void res.status(500).send();

  const { sessionId } = parsed.data;

  await pg`UPDATE sessions SET expires_at=${date.utc()} WHERE id=${sessionId} AND user_id=${info.userId}`;

  return void res.status(200).send({});
}

export default {
  getCurrentSession,
  getSessions,
  terminateSession,
}