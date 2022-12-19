import sage from "@dorkodu/sage-server";
import { z } from "zod";

import {
  getAccessesSchema, grantAccessSchema,
  revokeAccessSchema
} from "../schemas/access";
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
  async (_arg, _ctx) => {
    return undefined;
  }
)

const revokeAccess = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof revokeAccessSchema>,
  async (_arg, _ctx) => {
    return undefined;
  }
)

/*
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
*/

export default {
  getAccesses,
  grantAccess,
  revokeAccess,

  //queryCreateAccessToken,
  //queryExpireAccessToken,
  //queryGetAccessToken,
  //queryCreateAccessCode,
  //queryExpireAccessCode,
  //queryGetAccessCode,
}