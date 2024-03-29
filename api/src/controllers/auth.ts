import { Request, Response } from "express";
import { token } from "../lib/token";

import pg from "../pg";
import {
  confirmSignupSchema,
  loginSchema,
  signupSchema,
  verifyLoginSchema,
} from "../schemas/auth";
import { SchemaContext } from "./_schema";
import sage from "@dorkodu/sage-server";
import { z } from "zod";
import { snowflake } from "../lib/snowflake";
import { date } from "../lib/date";
import { crypto } from "../lib/crypto";
import { mailer } from "../lib/mail/mailer";
import { util } from "../lib/util";
import { userAgent } from "../lib/user_agent";
import { sharedSchemas } from "../schemas/_shared";
import { ErrorCode } from "../types/error_codes";

async function middleware(ctx: SchemaContext) {
  const rawToken = token.get(ctx.req, "session");
  const parsedToken = rawToken ? token.parse(rawToken) : undefined;
  if (!parsedToken) return;

  const session = await queryGetSession(ctx.req);
  if (!session) return;
  if (!token.check(session, parsedToken.validator)) return;

  ctx.userId = session.userId;
  ctx.sessionId = session.id;
}

const auth = sage.resource(
  {} as SchemaContext,
  undefined,
  async (_arg, ctx): Promise<{ data?: {}; error?: ErrorCode }> => {
    if (!(await getAuthInfo(ctx))) return { error: ErrorCode.Default };
    return { data: {} };
  }
);

const signup = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof signupSchema>,
  async (arg, _ctx): Promise<{ data?: {}; error?: ErrorCode }> => {
    const parsed = signupSchema.safeParse(arg);
    if (!parsed.success) return { error: ErrorCode.Default };

    const { username, email } = parsed.data;

    // Check if username/email is already used
    const [result0, result1] = await pg.begin(async (pg) => {
      const [result0]: [{ exists: boolean }?] = await pg`
        SELECT EXISTS (
          SELECT * FROM users WHERE username_ci=${username.toLowerCase()}
        )
      `;
      const [result1]: [{ exists: boolean }?] = await pg`
        SELECT EXISTS (
          SELECT * FROM users WHERE email_ci=${email.toLowerCase()}
        )
      `;
      return [result0, result1];
    });
    if (!result0) return { error: ErrorCode.Default };
    if (!result1) return { error: ErrorCode.Default };
    const usernameUsed = result0.exists;
    const emailUsed = result1.exists;
    if (usernameUsed && emailUsed) return { error: ErrorCode.UsernameAndEmailUsed };
    else if (usernameUsed) return { error: ErrorCode.UsernameUsed };
    else if (emailUsed) return { error: ErrorCode.EmailUsed };

    (async () => {
      // Create data necessary (sent_at & expires_at are set after email is sent)
      const tkn = token.create();
      const row = {
        id: snowflake.id("email_confirm_signup"),
        username: username,
        email: email,
        selector: tkn.selector,
        validator: crypto.sha256(tkn.validator),
        issued_at: date.utc(),
        sent_at: -1,
        expires_at: -1,
      };

      const sent = await mailer.sendConfirmSignup(email, tkn.full);
      if (!sent) return;

      // Set sent_at to now, expires_at to 10 minutes & insert to the database
      row.sent_at = date.utc();
      row.expires_at = date.minute(10);
      await pg`INSERT INTO email_confirm_signup ${pg(row)}`;
    })();

    return { data: {} };
  }
);

const confirmSignup = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof confirmSignupSchema>,
  async (arg, ctx): Promise<{ data?: {}; error?: ErrorCode }> => {
    const parsed = confirmSignupSchema.safeParse(arg);
    if (!parsed.success) return { error: ErrorCode.Default };

    const { password, token: tkn } = parsed.data;

    const parsedToken = token.parse(tkn);
    if (!parsedToken) return { error: ErrorCode.Default };

    const [result0]: [
      {
        username: string;
        email: string;
        validator: Buffer;
        sentAt: string;
        expiresAt: string;
      }?
    ] = await pg`
      SELECT username, email, validator, sent_at, expires_at
      FROM email_confirm_signup
      WHERE selector=${parsedToken.selector}
    `;
    if (!result0) return { error: ErrorCode.Default };
    if (util.intParse(result0.sentAt, -1) === -1) return { error: ErrorCode.Default };
    if (!token.check(result0, parsedToken.validator)) return { error: ErrorCode.Default };

    const row = {
      id: snowflake.id("users"),
      name: result0.username,
      bio: "",
      username: result0.username,
      username_ci: result0.username.toLowerCase(),
      email: result0.email,
      email_ci: result0.email.toLowerCase(),
      password: await crypto.encryptPassword(password),
      joined_at: date.utc(),
    };

    const result1 = await pg`INSERT INTO users ${pg(row)}`;
    if (result1.count === 0) return { error: ErrorCode.Default };

    if (!(await queryCreateSession(ctx.req, ctx.res, row.id)))
      return { error: ErrorCode.Default };

    return { data: {} };
  }
);

const login = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof loginSchema>,
  async (arg, ctx): Promise<{ data?: {}; error?: ErrorCode }> => {
    const parsed = loginSchema.safeParse(arg);
    if (!parsed.success) return { error: ErrorCode.Default };

    const { info, password } = parsed.data;

    const usernameParsed = sharedSchemas.username.safeParse(info);
    const username = usernameParsed.success ? usernameParsed.data : undefined;
    const emailParsed = sharedSchemas.email.safeParse(info);
    const email = emailParsed.success ? emailParsed.data : undefined;

    let [result0]: [{ id: string, email: string, password: Buffer }?] = [undefined];
    if (username) {
      [result0] = await pg`
        SELECT id, email, password FROM users 
        WHERE username_ci=${username.toLowerCase()}
      `;
    }
    else if (email) {
      [result0] = await pg`
        SELECT id, email, password FROM users 
        WHERE email_ci=${email.toLowerCase()}
      `;
    }
    else return { error: ErrorCode.Default };

    if (!result0) return { error: ErrorCode.Default };
    if (!(await crypto.comparePassword(password, result0.password)))
      return { error: ErrorCode.Default };

    const ip = util.getIP(ctx.req);
    const ua = userAgent.get(ctx.req);

    // If there is no session with this ip for the
    // given user, send an email link which expires in 10 minutes
    const [result1]: [{ exists: boolean }?] = await pg`
      SELECT EXISTS (
        SELECT * FROM sessions WHERE user_id=${result0.id} AND ip=${ip}
      )
    `;
    if (!result1) return { error: ErrorCode.Default };

    if (!result1.exists) {
      const tkn = token.create();
      const row = {
        id: snowflake.id("email_verify_login"),
        userId: result0.id,
        selector: tkn.selector,
        validator: crypto.sha256(tkn.validator),
        issuedAt: date.utc(),
        sentAt: -1,
        expiresAt: -1,
        ip: ip,
      };

      (async () => {
        const sent = await mailer.sendVerifyLogin(result0.email, tkn.full, ip, ua);
        if (!sent) return;

        row.sentAt = date.utc();
        row.expiresAt = date.minute(10);
        await pg`INSERT INTO email_verify_login ${pg(row)}`;
      })();

      return { error: ErrorCode.LoginNewLocation };
    }

    if (!(await queryCreateSession(ctx.req, ctx.res, result0.id)))
      return { error: ErrorCode.Default };

    return { data: {} };
  }
);

const verifyLogin = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof verifyLoginSchema>,
  async (arg, ctx): Promise<{ data?: {}; error?: ErrorCode }> => {
    const parsed = verifyLoginSchema.safeParse(arg);
    if (!parsed.success) return { error: ErrorCode.Default };

    const rawToken = parsed.data.token;
    const parsedToken = rawToken ? token.parse(rawToken) : undefined;
    if (!parsedToken) return { error: ErrorCode.Default };

    const [result0]: [{
      id: string;
      validator: Buffer;
      sentAt: string;
      expiresAt: string;
      userId: string;
    }?] = await pg`
      SELECT id, validator, sent_at, expires_at, user_id FROM email_verify_login
      WHERE selector=${parsedToken.selector}
    `;
    if (!result0) return { error: ErrorCode.Default };
    if (util.intParse(result0.sentAt, -1) === -1) return { error: ErrorCode.Default };
    if (!token.check(result0, parsedToken.validator)) return { error: ErrorCode.Default };

    // Expire the email_verify_login
    await pg`UPDATE email_verify_login SET expires_at=${date.utc()} WHERE id=${result0.id}`;

    // Create a session for the user and assing a session cookie
    if (!(await queryCreateSession(ctx.req, ctx.res, result0.userId))) return { error: ErrorCode.Default };

    return { data: {} };
  }
);

const logout = sage.resource(
  {} as SchemaContext,
  undefined,
  async (_arg, ctx): Promise<{ data?: {}; error?: ErrorCode }> => {
    const authInfo = await getAuthInfo(ctx);
    if (!authInfo) return { error: ErrorCode.Default };
    await queryExpireSession(ctx.res, authInfo.sessionId, authInfo.userId);
    return { data: {} };
  }
);

async function queryGetSession(req: Request) {
  const rawToken = token.get(req, "session");
  const parsedToken = rawToken ? token.parse(rawToken) : undefined;
  if (!parsedToken) return undefined;

  const [result]: [
    { id: string; userId: string; validator: Buffer; expiresAt: string }?
  ] = await pg`
    SELECT id, user_id, validator, expires_at FROM sessions WHERE selector=${parsedToken.selector}
  `;

  return result;
}

async function queryCreateSession(
  req: Request,
  res: Response,
  userId: string
): Promise<boolean> {
  const tkn = token.create();
  const row = {
    id: snowflake.id("sessions"),
    user_id: userId,
    selector: tkn.selector,
    validator: crypto.sha256(tkn.validator),
    createdAt: date.utc(),
    expiresAt: date.day(30),
    userAgent: userAgent.get(req),
    ip: util.getIP(req),
  };

  const result = await pg`INSERT INTO sessions ${pg(row)}`;
  if (result.count === 0) return false;

  token.attach(res, { value: tkn.full, expiresAt: row.expiresAt }, "session");
  return true;
}

async function queryExpireSession(res: Response, sessionId: string, userId: string) {
  await pg`UPDATE sessions SET expires_at=${date.utc()} WHERE id=${sessionId} AND user_id=${userId}`;
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
  confirmSignup,

  login,
  verifyLogin,

  logout,

  getAuthInfo,
}
