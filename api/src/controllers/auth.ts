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
  const rawToken = token.get(ctx.req);
  const parsedToken = rawToken ? token.parse(rawToken) : undefined;
  if (!parsedToken) return;

  const tkn = await queryGetToken(ctx.req);
  if (!tkn) return;
  if (!token.compare(parsedToken.validator, tkn.validator)) return;
  if (date.utc() >= tkn.expiresAt) return;

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

const initiateSignup = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof initiateSignupSchema>,
  async (arg, _ctx) => {
    const parsed = initiateSignupSchema.safeParse(arg);
    if (!parsed.success) return undefined;

    const { username, email } = parsed.data;

    const [result0]: [{ count: number }?] = await pg`
      SELECT COUNT(*) FROM users WHERE username=${username} OR email=${email}
    `;
    if (!result0) return undefined;
    if (result0.count !== 0) return undefined;

    const [result1]: [{ count: number }?] = await pg`
      SELECT COUNT(*) FROM email_verify_email
      WHERE username=${username} AND email=${email} AND expires_at>${date.utc()} AND tries_left>0
    `;
    if (!result1) return undefined;
    if (result1.count !== 0) return undefined;

    const row = {
      username: username,
      email: email,
      otp: crypto.otp(),
      sent_at: -1,
      expires_at: -1,
      tries_left: 3
    }

    const sent = await mailer.sendConfirmEmail(email, row.otp);
    if (!sent) return undefined;

    row.sent_at = date.utc();
    row.expires_at = date.utc() + 60 * 10; // 10 minutes
    await pg`INSERT INTO email_verify_email ${pg(row)}`;

    return {};
  }
)

const confirmSignup = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof confirmSignupSchema>,
  async (arg, ctx) => {
    const parsed = confirmSignupSchema.safeParse(arg);
    if (!parsed.success) return undefined;

    const { username, email, password, otp } = parsed.data;

    const [result0]: [{ count: number }?] = await pg`
      SELECT COUNT(*) FROM users WHERE username=${username} OR email=${email}
    `;
    if (!result0) return undefined;
    if (result0.count !== 0) return undefined;

    const [result1]: [{ id: number, otp: number }?] = await pg`
      UPDATE email_verify_email SET tries_left=tries_left-1
      WHERE id=(
        SELECT id FROM email_verify_email
        WHERE username=${username} AND email=${email} AND expires_at>${date.utc()} AND tries_left>0
        ORDER BY id DESC 
        LIMIT 1
      )
      RETURNING id, otp
    `;
    if (!result1) return undefined;
    if (result1.otp.toString() !== otp) return undefined;

    const row = {
      username: username,
      email: email,
      password: await crypto.encryptPassword(password),
      joined_at: date.utc(),
    }

    const [result2, result3] = await pg.begin(pg => [
      pg`INSERT INTO users ${pg(row)} RETURNING id`,
      pg`UPDATE email_verify_email SET expires_at=${date.utc()} WHERE id=${result1.id}`,
    ]);
    if (!result2.count) return undefined;
    if (!result3.count) return undefined;

    const userId: number | undefined = result2[0]?.id;
    if (userId === undefined) return undefined;
    if (!await queryCreateToken(ctx.req, ctx.res, userId)) return undefined;
    return {};
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
    if (!await queryCreateToken(ctx.req, ctx.res, result0.id)) return undefined;

    (async () => {
      const ip = ctx.req.headers["x-real-ip"] as string;
      const ua = userAgent.parse(ctx.req.headers["user-agent"]);
      const [result1]: [{ count: number }?] = await pg`
        SELECT COUNT(*) FROM sessions
        WHERE user_id=${result0.id} AND ip=${ip}
      `;
      if (!result1) return;
      if (result1.count > 1) return;

      await mailer.sendNewLocation(result0.email, ip, ua);
    })();

    return {};
  }
)

const logout = sage.resource(
  {} as SchemaContext,
  undefined,
  async (_arg, ctx) => {
    const authInfo = await getAuthInfo(ctx);
    if (!authInfo) return undefined;
    await queryExpireToken(ctx.res, authInfo.tokenId, authInfo.userId);
    return {};
  }
)

async function queryGetToken(req: Request) {
  const rawToken = token.get(req);
  const parsedToken = rawToken ? token.parse(rawToken) : undefined;
  if (!parsedToken) return undefined;

  const [result]: [{ id: number, userId: number, validator: Buffer, expiresAt: number }?] = await pg`
    SELECT id, user_id, validator, expires_at FROM sessions WHERE selector=${parsedToken.selector}
  `;

  return result;
}

async function queryCreateToken(req: Request, res: Response, userId: number): Promise<boolean> {
  const tkn = token.create();

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

  token.attach(res, { value: tkn.full, expiresAt: tkn.expiresAt });
  return true;
}

async function queryExpireToken(res: Response, tokenId: number, userId: number) {
  await pg`UPDATE sessions SET expires_at=${date.utc()} WHERE id=${tokenId} AND user_id=${userId}`;
  token.detach(res);
}

async function getAuthInfo(ctx: SchemaContext) {
  if (!ctx.triedAuth) await middleware(ctx);
  ctx.triedAuth = true;

  if (ctx.tokenId === undefined || ctx.userId === undefined) return undefined;
  return { tokenId: ctx.tokenId, userId: ctx.userId };
}

export default {
  middleware,
  auth,
  initiateSignup,
  confirmSignup,
  login,
  logout,
  getAuthInfo,
}