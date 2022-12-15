import sage from "@dorkodu/sage-server";
import { Request } from "express";
import { z } from "zod";
import { IAccess } from "../../../shared/src/access";
import { config } from "../config";
import { crypto } from "../lib/crypto";
import { date } from "../lib/date";
import { token } from "../lib/token";
import { userAgent } from "../lib/user_agent";
import pg from "../pg";

import {
  getAccessesSchema, grantAccessSchema,
  revokeAccessSchema
} from "../schemas/access";
import auth from "./auth";
import { RouterContext } from "./_router";

const getAccesses = sage.route(
  {} as RouterContext,
  {} as z.infer<typeof getAccessesSchema>,
  async (input, ctx) => {
    const parsed = getAccessesSchema.safeParse(input);
    if (!parsed.success) return undefined;

    const info = auth.getAuthInfo(ctx.res);
    if (!info) return undefined;

    const { anchor, type } = parsed.data;
    const result = await pg<IAccess[]>`
      SELECT id, created_at, expires_at, user_agent, ip, service FROM access_tokens
      WHERE user_id=${info.userId} AND expires_at>${date.utc()}
      ${anchor === -1 ? pg`` : type === "newer" ? pg`AND id>${anchor}` : pg`AND id<${anchor}`}
      ORDER BY id ${anchor === -1 ? pg`DESC` : type === "newer" ? pg`ASC` : pg`DESC`}
      LIMIT 10
    `;
    if (!result.length) return undefined;

    return result;
  }
)

const grantAccess = sage.route(
  {} as RouterContext,
  {} as z.infer<typeof grantAccessSchema>,
  async (input, ctx) => {
    const parsed = grantAccessSchema.safeParse(input);
    if (!parsed.success) return undefined;

    const info = auth.getAuthInfo(ctx.res);
    if (!info) return undefined;

    // Check for white-listed services
    if (!config.serviceWhitelist.includes(parsed.data.service)) return undefined;

    const code = await queryCreateAccessCode(ctx.req, info.userId, parsed.data.service);
    if (!code) return undefined;

    return { code };
  }
)

const revokeAccess = sage.route(
  {} as RouterContext,
  {} as z.infer<typeof revokeAccessSchema>,
  async (input, ctx) => {
    const parsed = revokeAccessSchema.safeParse(input);
    if (!parsed.success) return undefined;

    const info = auth.getAuthInfo(ctx.res);
    if (!info) return undefined;

    await queryExpireAccessToken(parsed.data.accessId, info.userId);

    return {};
  }
)

async function queryCreateAccessToken(userId: number, userAgent: string, ip: string, service: string) {
  const tkn = token.create();

  const row = {
    user_id: userId,
    selector: tkn.selector,
    validator: crypto.sha256(tkn.validator),
    created_at: tkn.createdAt,
    expires_at: tkn.expiresAt,
    user_agent: userAgent,
    ip: ip,
    service: service,
  }

  const result = await pg`INSERT INTO access_tokens ${pg(row)}`;
  if (!result.count) return undefined;

  return tkn.full;
}

async function queryExpireAccessToken(tokenId: number, userId: number) {
  await pg`UPDATE access_tokens SET expires_at=${date.utc()} WHERE id=${tokenId} AND user_id=${userId}`
}

async function queryGetAccessToken(tkn: string) {
  const rawToken = tkn;
  const parsedToken = token.parse(rawToken);
  if (!parsedToken) return undefined;

  const [result]: [{
    id: number,
    userId: number,
    validator: Buffer,
    expiresAt: number
  }?] = await pg`
    SELECT id, user_id, validator, expires_at FROM access_codes 
    WHERE selector=${parsedToken.selector}
  `

  return result;
}

async function queryCreateAccessCode(req: Request, userId: number, service: string): Promise<string | undefined> {
  const tkn = token.create();

  const row = {
    user_id: userId,
    selector: tkn.selector,
    validator: crypto.sha256(tkn.validator),
    created_at: tkn.createdAt,
    expires_at: tkn.createdAt + 60 * 10, // 10 minutes
    user_agent: userAgent.parse(req.headers["user-agent"]),
    ip: req.headers["x-real-ip"] as string,
    service: service,
  }

  const result = await pg`INSERT INTO access_codes ${pg(row)}`;
  if (!result.count) return undefined;

  return tkn.full;
}

async function queryExpireAccessCode(codeId: number, userId: number) {
  await pg`UPDATE access_codes SET expires_at=${date.utc()} WHERE id=${codeId} AND user_id=${userId}`
}

async function queryGetAccessCode(code: string) {
  const rawToken = code;
  const parsedToken = token.parse(rawToken);
  if (!parsedToken) return undefined;

  const [result]: [{
    id: number,
    userId: number,
    validator: Buffer,
    expiresAt: number,
    userAgent: string,
    ip: string,
    service: string
  }?] = await pg`
    SELECT id, user_id, validator, expires_at, user_agent, ip, service FROM access_codes 
    WHERE selector=${parsedToken.selector}
  `

  return result;
}

export default {
  getAccesses,
  grantAccess,
  revokeAccess,

  queryCreateAccessToken,
  queryExpireAccessToken,
  queryGetAccessToken,
  queryCreateAccessCode,
  queryExpireAccessCode,
  queryGetAccessCode,
}