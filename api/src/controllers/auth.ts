import { Request, Response } from "express";
import { token } from "../lib/token";

import pg from "../pg";
import { confirmSignupSchema, loginSchema, signupSchema, verifySignupSchema } from "../schemas/auth";
import { SchemaContext } from "./_schema";
import sage from "@dorkodu/sage-server";
import { z } from "zod";
import { snowflake } from "../lib/snowflake";
import { date } from "../lib/date";
import { crypto } from "../lib/crypto";
import { mailer } from "../lib/mailer";
import { util } from "../lib/util";
import { userAgent } from "../lib/user_agent";

async function middleware(_ctx: SchemaContext) {
  //const rawToken = token.get(ctx.req, "session");
  //const parsedToken = rawToken ? token.parse(rawToken) : undefined;
  //if (!parsedToken) return;
  //
  //const tkn = await queryGetSession(ctx.req);
  //if (!tkn) return;
  //if (!token.compare(parsedToken.validator, tkn.validator)) return;
  //if (date.utc() >= tkn.expiresAt) return;
  //
  //ctx.userId = tkn.userId;
  //ctx.tokenId = tkn.id;
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
  async (arg, ctx) => {
    const parsed = signupSchema.safeParse(arg);
    if (!parsed.success) return undefined;

    const { username, email } = parsed.data;

    // Check if username or email is already used
    const [result0]: [{ count: string }?] = await pg`
      SELECT COUNT(*) FROM users WHERE username=${username} OR email=${email}
    `;
    if (!result0) return undefined;
    if (util.intParse(result0.count, 0) !== 0) return undefined;

    // Create data necessary (sent_at & expires_at are set after email is sent)
    const tkn = token.create();
    const row = {
      id: snowflake.id("email_verify_signup"),
      username: username,
      email: email,
      selector: tkn.selector,
      validator: crypto.sha256(tkn.validator),
      issued_at: date.utc(),
      sent_at: -1,
      expires_at: -1,
      verified: false
    }

    // Try to send a signup verification mail
    const sent = await mailer.sendVerifySignup(email, tkn.full, util.getIP(ctx.req), userAgent.get(ctx.req));
    if (!sent) return undefined;

    // Set sent_at to now, expires_at to 10 minutes & insert to the database
    row.sent_at = date.utc();
    row.expires_at = date.minute(10);
    const result1 = await pg`INSERT INTO email_verify_signup ${pg(row)}`;
    if (!result1) return undefined;

    // Attach a temporary cookie for signup confirmation
    token.attach(ctx.res, { value: tkn.full, expiresAt: row.expires_at }, "temp");

    return {}
  }
)

const verifySignup = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof verifySignupSchema>,
  async (arg, _ctx) => {
    const parsed = verifySignupSchema.safeParse(arg);
    if (!parsed.success) return undefined;

    const rawToken = parsed.data.token;
    const parsedToken = rawToken ? token.parse(rawToken) : undefined;
    if (!parsedToken) return undefined;

    const [result0]: [{ id: string, validator: Buffer, expiresAt: string }?] = await pg`
      SELECT id, validator, expires_at FROM email_verify_signup
      WHERE selector=${parsedToken.selector} AND sent_at!='-1'
    `
    if (!result0) return undefined;
    if (!token.compare(parsedToken.validator, result0.validator)) return undefined;
    if (date.utc() >= util.intParse(result0.expiresAt, -1)) return undefined;

    const result1 = await pg`
      UPDATE email_verify_signup SET verified=TRUE
      WHERE id=${result0.id}
    `
    if (result1.count === 0) return undefined;

    return {}
  }
)

const confirmSignup = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof confirmSignupSchema>,
  async (arg, ctx) => {
    const parsed = confirmSignupSchema.safeParse(arg);
    if (!parsed.success) return undefined;

    const { username, email, password } = parsed.data;

    const rawToken = token.get(ctx.req, "temp");
    const parsedToken = rawToken ? token.parse(rawToken) : undefined;
    if (!parsedToken) return undefined;

    const [result0]: [{
      username: string,
      email: string,
      validator: Buffer,
      expiresAt: string,
      verified: boolean
    }?] = await pg`
      SELECT username, email, validator, expires_at, verified FROM email_verify_signup
      WHERE selector=${parsedToken.selector} AND sent_at!='-1'
    `
    if (!result0) return undefined;
    if (!result0.verified) return undefined;
    if (result0.username !== username) return undefined;
    if (result0.email !== email) return undefined;
    if (date.utc() >= util.intParse(result0.expiresAt, -1)) return undefined;
    if (!token.compare(parsedToken.validator, result0.validator)) return undefined;

    const row = {
      id: snowflake.id("users"),
      username: username,
      email: email,
      password: await crypto.encryptPassword(password),
      joined_at: date.utc(),
    }

    const result1 = await pg`INSERT INTO users ${pg(row)}`;
    if (result1.count === 0) return undefined;

    if (!await queryCreateSession(ctx.req, ctx.res, row.id)) return undefined;

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

/*
async function queryGetSession(_req: Request) {
  //const rawToken = token.get(req, "session");
  //const parsedToken = rawToken ? token.parse(rawToken) : undefined;
  //if (!parsedToken) return undefined;
  //
  //const [result]: [{ id: number, userId: number, validator: Buffer, expiresAt: number }?] = await pg`
  //  SELECT id, user_id, validator, expires_at FROM sessions WHERE selector=${parsedToken.selector}
  //`;
  //
  //return result;
}
*/

async function queryCreateSession(req: Request, res: Response, userId: string): Promise<boolean> {
  const tkn = token.create();

  const row = {
    id: snowflake.id("sessions"),
    user_id: userId,
    selector: tkn.selector,
    validator: crypto.sha256(tkn.validator),
    created_at: date.utc(),
    expires_at: date.day(30),
    user_agent: userAgent.get(req),
    ip: util.getIP(req),
  }

  const result = await pg`INSERT INTO sessions ${pg(row)}`;
  if (result.count === 0) return false;

  token.attach(res, { value: tkn.full, expiresAt: row.expires_at }, "session");
  return true;
}

async function queryExpireSession(_res: Response, _tokenId: number, _userId: number) {
  //await pg`UPDATE sessions SET expires_at=${Date.now()} WHERE id=${tokenId} AND user_id=${userId}`;
  //token.detach(res, "session");
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