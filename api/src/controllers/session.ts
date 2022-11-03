import { Request, Response } from "express";
import pg from "../pg";
import { getCurrentSessionSchema, getSessionsSchema, terminateSessionSchema } from "../schemas/session";
import auth from "./auth";

async function getCurrentSession(req: Request, res: Response<{ id: number, createdAt: number, expiresAt: number, userAgent: string, ip: string }>) {
  const parsed = getCurrentSessionSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const info = auth.getAuthInfo(res);
  if (!info) return void res.status(500).send();

  const [result]: [{ id: number, createdAt: number, expiresAt: number, userAgent: string, ip: string }?] = await pg`
    SELECT id, created_at, expires_at, user_agent, ip FROM sessions WHERE id=${info.tokenId}
  `;
  if (!result) return void res.status(500).send();

  return void res.status(200).send(result);
}

async function getSessions(req: Request, res: Response<{ id: number, createdAt: number, expiresAt: number, userAgent: string, ip: string }[]>) {
  const parsed = getSessionsSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const info = auth.getAuthInfo(res);
  if (!info) return void res.status(500).send();

  const { anchor } = parsed.data;
  const result = await pg<{ id: number, createdAt: number, expiresAt: number, userAgent: string, ip: string }[]>`
    SELECT id, created_at, expires_at, user_agent, ip FROM sessions
    WHERE user_id=${info.userId} ${anchor === -1 ? pg`` : pg`AND id<${anchor}`}
    ORDER BY id DESC
    LIMIT 10
  `;
  if (!result.length) return void res.status(500).send();

  return void res.status(200).send(result);
}

async function terminateSession(req: Request, res: Response) {
  const parsed = terminateSessionSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const info = auth.getAuthInfo(res);
  if (!info) return void res.status(500).send();

  const { sessionId } = parsed.data;

  const [result]: [{ id: number }?] = await pg`
    DELETE FROM sessions WHERE id=${sessionId} AND user_id=${info.userId} RETURNING id
  `;
  if (!result) return void res.status(500).send();

  return void res.status(200).send({});
}

export default {
  getCurrentSession,
  getSessions,
  terminateSession,
}