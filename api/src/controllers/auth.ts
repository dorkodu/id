import { Request, Response } from "express";
import { token } from "../lib/token";

import pg from "../pg";
import { confirmSignupSchema, loginSchema, signupSchema, verifyLoginSchema, verifySignupSchema } from "../schemas/auth";
import { SchemaContext } from "./_schema";
import sage from "@dorkodu/sage-server";
import { z } from "zod";
import { snowflake } from "../lib/snowflake";
import { date } from "../lib/date";
import { crypto } from "../lib/crypto";
import { mailer } from "../lib/mailer";
import { util } from "../lib/util";
import { userAgent } from "../lib/user_agent";
import { sharedSchemas } from "../schemas/_shared";

async function middleware(ctx: SchemaContext) {
  const rawToken = token.get(ctx.req, "session");
  const parsedToken = rawToken ? token.parse(rawToken) : undefined;
  if (!parsedToken) return;

  const session = await queryGetSession(ctx.req);
  if (!session) return;
  if (!token.compare(parsedToken.validator, session.validator)) return;
  if (date.utc() >= util.intParse(session.expiresAt, -1)) return;

  ctx.userId = session.userId;
  ctx.sessionId = session.id;
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
    if (result1.count === 0) return undefined;

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
      sentAt: string,
      expiresAt: string,
      verified: boolean
    }?] = await pg`
      SELECT username, email, validator, sent_at, expires_at, verified FROM email_verify_signup
      WHERE selector=${parsedToken.selector}
    `
    if (!result0) return undefined;
    if (!result0.verified) return undefined;
    if (result0.username !== username) return undefined;
    if (result0.email !== email) return undefined;
    if (util.intParse(result0.sentAt, -1) === -1) return undefined;
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
    token.detach(ctx.res, "temp");

    return {}
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

    let [result0]: [{ id: string, email: string, password: Buffer }?] = [undefined];
    if (username) [result0] = await pg`SELECT id, email, password FROM users WHERE username=${username}`;
    else if (email) [result0] = await pg`SELECT id, email, password FROM users WHERE email=${email}`;
    else return undefined;

    if (!result0) return undefined;
    if (!await crypto.comparePassword(password, result0.password)) return undefined;

    const ip = util.getIP(ctx.req);
    const ua = userAgent.get(ctx.req);

    // If there is no session & no login verification with this ip
    // for the given users, send an email link which expires in 10 minutes 
    const [result1]: [{ count: string }?] = await pg`
      SELECT COUNT(*) FROM sessions
      WHERE user_id=${result0.id} AND ip=${ip}
    `;
    if (!result1 || util.intParse(result1.count, 0) === 0) {
      const [result2]: [{ count: string }?] = await pg`
        SELECT COUNT(*) FROM email_verify_login
        WHERE user_id=${result0.id} AND ip=${ip} AND verified=TRUE
      `;
      if (!result2 || util.intParse(result2.count, 0) === 0) {
        const tkn = token.create();
        const row = {
          id: snowflake.id("email_verify_login"),
          userId: result0.id,
          selector: tkn.selector,
          validator: crypto.sha256(tkn.validator),
          issued_at: date.utc(),
          sent_at: -1,
          expires_at: -1,
          verified: false,
          ip: ip,
        }

        const sent = await mailer.sendVerifyLogin(result0.email, tkn.full, ip, ua);
        if (!sent) return undefined;

        row.sent_at = date.utc();
        row.expires_at = date.minute(10);
        const result1 = await pg`INSERT INTO email_verify_login ${pg(row)}`;
        if (result1.count === 0) return undefined;

        return { err: "" };
      }
    }

    if (!await queryCreateSession(ctx.req, ctx.res, result0.id)) return undefined;

    return {};
  }
)

const verifyLogin = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof verifyLoginSchema>,
  async (arg, _ctx) => {
    const parsed = verifyLoginSchema.safeParse(arg);
    if (!parsed.success) return undefined;

    const rawToken = parsed.data.token;
    const parsedToken = rawToken ? token.parse(rawToken) : undefined;
    if (!parsedToken) return undefined;

    const [result0]: [{
      id: string,
      validator: Buffer,
      sentAt: string,
      expiresAt: string,
      verified: boolean
    }?] = await pg`
      SELECT id, validator, sent_at, expires_at FROM email_verify_login
      WHERE selector=${parsedToken.selector}
    `
    if (!result0) return undefined;
    if (util.intParse(result0.sentAt, -1) === -1) return undefined;
    if (date.utc() >= util.intParse(result0.expiresAt, -1)) return undefined;
    if (!token.compare(parsedToken.validator, result0.validator)) return undefined;

    const result1 = await pg`
      UPDATE email_verify_login SET verified=TRUE
      WHERE id=${result0.id}
    `
    if (result1.count === 0) return undefined;

    return {}
  }
)

const logout = sage.resource(
  {} as SchemaContext,
  undefined,
  async (_arg, ctx) => {
    const authInfo = await getAuthInfo(ctx);
    if (!authInfo) return undefined;
    await queryExpireSession(ctx.res, authInfo.sessionId, authInfo.userId);
    return {};
  }
)

async function queryGetSession(req: Request) {
  const rawToken = token.get(req, "session");
  const parsedToken = rawToken ? token.parse(rawToken) : undefined;
  if (!parsedToken) return undefined;

  const [result]: [{ id: string, userId: string, validator: Buffer, expiresAt: string }?] = await pg`
    SELECT id, user_id, validator, expires_at FROM sessions WHERE selector=${parsedToken.selector}
  `;

  return result;
}

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

async function queryExpireSession(res: Response, sessionId: string, userId: string) {
  await pg`UPDATE sessions SET expires_at=${Date.now()} WHERE id=${sessionId} AND user_id=${userId}`;
  token.detach(res, "session");
}

async function getAuthInfo(ctx: SchemaContext) {
  if (!ctx.triedAuth) await middleware(ctx);
  ctx.triedAuth = true;

  if (ctx.sessionId === undefined || ctx.userId === undefined) return undefined;
  return { sessionId: ctx.sessionId, userId: ctx.userId };
}

export default {
  auth,

  signup,
  verifySignup,
  confirmSignup,

  login,
  verifyLogin,

  logout,

  getAuthInfo,
}