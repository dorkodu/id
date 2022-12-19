import { Request, Response } from "express";
import { crypto } from "../lib/crypto";
import { date } from "../lib/date";
import { mailer } from "../lib/mailer";
import { token } from "../lib/token";
import { userAgent } from "../lib/user_agent";

import pg from "../pg";
import { confirmSignupSchema, initiateSignupSchema, loginSchema } from "../schemas/auth";
import { sharedSchemas } from "../schemas/_shared";
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
  undefined,
  async (_arg, _ctx) => {

  }
)

const verifySignup = sage.resource(
  {} as SchemaContext,
  undefined,
  async (_arg, _ctx) => {

  }
)

const confirmSignup = sage.resource(
  {} as SchemaContext,
  undefined,
  async (_arg, _ctx) => {
  }
)

const login = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof loginSchema>,
  async (arg, ctx) => {
    const parsed = loginSchema.safeParse(arg);
    if (!parsed.success) return undefined;

    const { info, password } = parsed.data;
    const usernameParsed = sharedSchemas.username.safeParse(info);
    const username = usernameParsed.success ? usernameParsed.data : undefined;
    const emailParsed = sharedSchemas.email.safeParse(info);
    const email = emailParsed.success ? emailParsed.data : undefined;

    let [result0]: [{ id: number, email: string, password: Buffer }?] = [undefined];
    if (username) [result0] = await pg`SELECT id, email, password FROM users WHERE username=${username}`;
    else if (email) [result0] = await pg`SELECT id, email, password FROM users WHERE email=${email}`;
    else return undefined;

    if (!result0) return undefined;
    if (!await crypto.comparePassword(password, result0.password)) return undefined;
    //if (!await queryCreateSession(ctx.req, ctx.res, result0.id)) return undefined;
    //
    //(async () => {
    //  const ip = ctx.req.headers["x-real-ip"] as string;
    //  const ua = userAgent.parse(ctx.req.headers["user-agent"]);
    //  const [result1]: [{ count: number }?] = await pg`
    //    SELECT COUNT(*) FROM sessions
    //    WHERE user_id=${result0.id} AND ip=${ip}
    //  `;
    //  if (!result1) return;
    //  if (result1.count > 1) return;
    //
    //  await mailer.sendNewLocation(result0.email, ip, ua);
    //})();

    return {};
  }
)

const verifyLogin = sage.resource(
  {} as SchemaContext,
  undefined,
  async (_arg, _ctx) => {

  }
)

const confirmLogin = sage.resource(
  {} as SchemaContext,
  undefined,
  async (_arg, _ctx) => {

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