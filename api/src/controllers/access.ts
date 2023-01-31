import sage from "@dorkodu/sage-server";
import { z } from "zod";
import { config } from "../config";
import { crypto } from "../lib/crypto";
import { date } from "../lib/date";
import { snowflake } from "../lib/snowflake";
import { token } from "../lib/token";
import { userAgent } from "../lib/user_agent";
import { util } from "../lib/util";
import pg from "../pg";

import {
  getAccessesSchema, grantAccessSchema,
  revokeAccessSchema
} from "../schemas/access";
import { IAccessParsed, iAccessSchema } from "../types/access";
import { ErrorCode } from "../types/error_codes";
import auth from "./auth";
import { SchemaContext } from "./_schema";

const getAccesses = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof getAccessesSchema>,
  async (arg, ctx): Promise<{ data?: IAccessParsed[], error?: ErrorCode }> => {
    const parsed = getAccessesSchema.safeParse(arg);
    if (!parsed.success) return { error: ErrorCode.Default };

    const info = await auth.getAuthInfo(ctx);
    if (!info) return { error: ErrorCode.Default };

    const { anchor, type } = parsed.data;
    const result = await pg`
      SELECT id, created_at, expires_at, user_agent, ip, service FROM access_tokens
      WHERE user_id=${info.userId} AND expires_at>${date.utc()}
      ${anchor === "-1" ? pg`` : type === "newer" ? pg`AND id>${anchor}` : pg`AND id<${anchor}`}
      ORDER BY id ${anchor === "-1" ? pg`DESC` : type === "newer" ? pg`ASC` : pg`DESC`}
      LIMIT 10
    `;
    if (result.length === 0) return { error: ErrorCode.Default };

    const res: IAccessParsed[] = [];
    result.forEach(session => {
      const parsed = iAccessSchema.safeParse(session);
      if (parsed.success) res.push(parsed.data);
    });

    return { data: res };
  }
)

const grantAccess = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof grantAccessSchema>,
  async (arg, ctx): Promise<{ data?: { code: string }, error?: ErrorCode }> => {
    const parsed = grantAccessSchema.safeParse(arg);
    if (!parsed.success) return { error: ErrorCode.Default };

    const info = await auth.getAuthInfo(ctx);
    if (!info) return { error: ErrorCode.Default };

    // Check for white-listed services
    if (!config.serviceWhitelist.includes(parsed.data.service)) return { error: ErrorCode.Default };

    const ua = userAgent.get(ctx.req);
    const ip = util.getIP(ctx.req);
    const code = await queryCreateAccessCode(info.userId, ua, ip, parsed.data.service);
    if (code === undefined) return { error: ErrorCode.Default };

    return { data: { code } };
  }
)

const revokeAccess = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof revokeAccessSchema>,
  async (arg, ctx): Promise<{ data?: {}, error?: ErrorCode }> => {
    const parsed = revokeAccessSchema.safeParse(arg);
    if (!parsed.success) return { error: ErrorCode.Default };

    const info = await auth.getAuthInfo(ctx);
    if (!info) return { error: ErrorCode.Default };

    await queryExpireAccessToken(parsed.data.accessId, info.userId);

    return { data: {} };
  }
)

async function queryCreateAccessToken(userId: string, userAgent: string, ip: string, service: string) {
  const tkn = token.create();
  const row = {
    id: snowflake.id("access_tokens"),
    userId: userId,
    selector: tkn.selector,
    validator: crypto.sha256(tkn.validator),
    createdAt: date.utc(),
    expiresAt: date.day(30),
    userAgent: userAgent,
    ip: ip,
    service: service,
  }

  const result = await pg`INSERT INTO access_tokens ${pg(row)}`;
  if (result.count === 0) return undefined;

  return tkn.full;
}

async function queryExpireAccessToken(tokenId: string, userId: string) {
  await pg`UPDATE access_tokens SET expires_at=${date.utc()} WHERE id=${tokenId} AND user_id=${userId}`;
}

async function queryGetAccessToken(tkn: string) {
  const rawToken = tkn;
  const parsedToken = token.parse(rawToken);
  if (!parsedToken) return undefined;

  const [result]: [{
    id: string,
    userId: string,
    validator: Buffer,
    expiresAt: string
  }?] = await pg`
    SELECT id, user_id, validator, expires_at FROM access_tokens
    WHERE selector=${parsedToken.selector}
  `

  return result;
}

async function queryCreateAccessCode(userId: string, userAgent: string, ip: string, service: string) {
  const tkn = token.create();
  const row = {
    id: snowflake.id("access_codes"),
    userId: userId,
    selector: tkn.selector,
    validator: crypto.sha256(tkn.validator),
    createdAt: date.utc(),
    expiresAt: date.minute(10),
    userAgent: userAgent,
    ip: ip,
    service: service,
  }

  const result = await pg`INSERT INTO access_codes ${pg(row)}`;
  if (result.count === 0) return undefined;

  return tkn.full;
}

async function queryGetAccessCode(code: string) {
  const rawToken = code;
  const parsedToken = token.parse(rawToken);
  if (!parsedToken) return undefined;

  const [result]: [{
    id: string,
    userId: string,
    validator: Buffer,
    expiresAt: string,
    userAgent: string,
    ip: string,
    service: string
  }?] = await pg`
    SELECT id, user_id, validator, expires_at, user_agent, ip, service FROM access_codes 
    WHERE selector=${parsedToken.selector}
  `;

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
  queryGetAccessCode,
}