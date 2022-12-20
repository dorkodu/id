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
import auth from "./auth";
import { SchemaContext } from "./_schema";

const getAccesses = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof getAccessesSchema>,
  async (_arg, _ctx) => {
    return undefined;
  }
)

const grantAccess = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof grantAccessSchema>,
  async (arg, ctx) => {
    const parsed = grantAccessSchema.safeParse(arg);
    if (!parsed.success) return undefined;

    const info = await auth.getAuthInfo(ctx);
    if (!info) return undefined;

    // Check for white-listed services
    if (!config.serviceWhitelist.includes(parsed.data.service)) return undefined;

    const ua = userAgent.get(ctx.req);
    const ip = util.getIP(ctx.req);
    const code = await queryCreateAccessCode(info.userId, ua, ip, parsed.data.service);
    if (code === undefined) return undefined;

    return { code };
  }
)

const revokeAccess = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof revokeAccessSchema>,
  async (arg, ctx) => {
    const parsed = revokeAccessSchema.safeParse(arg);
    if (!parsed.success) return undefined;

    const info = await auth.getAuthInfo(ctx);
    if (!info) return undefined;

    await queryExpireAccessToken(parsed.data.accessId, info.userId);

    return {};
  }
)

async function queryCreateAccessToken(userId: string, userAgent: string, ip: string, service: string) {
  const tkn = token.create();
  const row = {
    id: snowflake.id("access_tokens"),
    user_id: userId,
    selector: tkn.selector,
    validator: crypto.sha256(tkn.validator),
    created_at: date.utc(),
    expires_at: date.day(30),
    user_agent: userAgent,
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
    SELECT id, user_id, validator, expires_at FROM access_codes 
    WHERE selector=${parsedToken.selector}
  `

  return result;
}

async function queryCreateAccessCode(userId: string, userAgent: string, ip: string, service: string) {
  const tkn = token.create();
  const row = {
    id: snowflake.id("access_codes"),
    user_id: userId,
    selector: tkn.selector,
    validator: crypto.sha256(tkn.validator),
    created_at: date.utc(),
    expires_at: date.minute(10),
    user_agent: userAgent,
    ip: ip,
    service: service,
  }

  const result = await pg`INSERT INTO access_codes ${pg(row)}`;
  if (result.count === 0) return undefined;

  return tkn.full;
}

async function queryExpireAccessCode(codeId: string, userId: string) {
  await pg`UPDATE access_codes SET expires_at=${date.utc()} WHERE id=${codeId} AND user_id=${userId}`;
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