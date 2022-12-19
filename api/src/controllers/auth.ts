import { Request, Response } from "express";
import { token } from "../lib/token";

import pg from "../pg";
import { confirmSignupSchema, loginSchema, signupSchema } from "../schemas/auth";
import { SchemaContext } from "./_schema";
import sage from "@dorkodu/sage-server";
import { z } from "zod";

async function middleware(ctx: SchemaContext) {
  const rawToken = token.get(ctx.req, "session");
  const parsedToken = rawToken ? token.parse(rawToken) : undefined;
  if (!parsedToken) return;

  const tkn = await queryGetSession(ctx.req);
  if (!tkn) return;
  if (!token.compare(parsedToken.validator, tkn.validator)) return;
  if (Date.now() >= tkn.expiresAt) return;

  ctx.userId = tkn.userId;
  ctx.tokenId = tkn.id;
}

const auth = sage.resource(
  {} as SchemaContext,
  undefined,
  async (_arg, ctx) => {
    if (!await getAuthInfo(ctx)) return undefined;
    return {};
  }
)

const signup = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof signupSchema>,
  async (_arg, _ctx) => {
    return {}
  }
)

const verifySignup = sage.resource(
  {} as SchemaContext,
  undefined,
  async (_arg, _ctx) => {
    return {}
  }
)

const confirmSignup = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof confirmSignupSchema>,
  async (_arg, _ctx) => {
    return {}
  }
)

const login = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof loginSchema>,
  async (_arg, _ctx) => {
    return {};
  }
)

const verifyLogin = sage.resource(
  {} as SchemaContext,
  undefined,
  async (_arg, _ctx) => {
    return {}
  }
)

const confirmLogin = sage.resource(
  {} as SchemaContext,
  undefined,
  async (_arg, _ctx) => {
    return {}
  }
)

const logout = sage.resource(
  {} as SchemaContext,
  undefined,
  async (_arg, ctx) => {
    const authInfo = await getAuthInfo(ctx);
    if (!authInfo) return undefined;
    await queryExpireSession(ctx.res, authInfo.tokenId, authInfo.userId);
    return {};
  }
)

async function queryGetSession(req: Request) {
  const rawToken = token.get(req, "session");
  const parsedToken = rawToken ? token.parse(rawToken) : undefined;
  if (!parsedToken) return undefined;

  const [result]: [{ id: number, userId: number, validator: Buffer, expiresAt: number }?] = await pg`
    SELECT id, user_id, validator, expires_at FROM sessions WHERE selector=${parsedToken.selector}
  `;

  return result;
}

/*
async function queryCreateSession(req: Request, res: Response, userId: number): Promise<boolean> {
  const tkn = token.create(Date.now(), date.day(30));

  const row = {
    user_id: userId,
    selector: tkn.selector,
    validator: crypto.sha256(tkn.validator),
    created_at: tkn.createdAt,
    expires_at: tkn.expiresAt,
    user_agent: userAgent.parse(req.headers["user-agent"]),
    ip: req.headers["x-real-ip"] as string
  }

  const result = await pg`INSERT INTO sessions ${pg(row)}`;
  if (!result.count) return false;

  token.attach(res, { value: tkn.full, expiresAt: tkn.expiresAt }, "session");
  return true;
}
*/

async function queryExpireSession(res: Response, tokenId: number, userId: number) {
  await pg`UPDATE sessions SET expires_at=${Date.now()} WHERE id=${tokenId} AND user_id=${userId}`;
  token.detach(res, "session");
}

async function getAuthInfo(ctx: SchemaContext) {
  if (!ctx.triedAuth) await middleware(ctx);
  ctx.triedAuth = true;

  if (ctx.tokenId === undefined || ctx.userId === undefined) return undefined;
  return { tokenId: ctx.tokenId, userId: ctx.userId };
}

export default {
  auth,

  signup,
  verifySignup,
  confirmSignup,

  login,
  verifyLogin,
  confirmLogin,

  logout,

  getAuthInfo,
}