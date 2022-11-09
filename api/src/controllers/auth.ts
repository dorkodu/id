import { NextFunction, Request, Response } from "express";
import { crypto } from "../lib/crypto";
import { date } from "../lib/date";
import { mailer } from "../lib/mailer";
import { token } from "../lib/token";
import { userAgent } from "../lib/user_agent";

import pg from "../pg";
import { authSchema, confirmSignupSchema, initiateSignupSchema, loginSchema, logoutSchema, OutputAuthSchema, OutputConfirmSignupSchema, OutputInitiateSignupSchema, OutputLoginSchema, OutputLogoutSchema } from "../schemas/auth";
import { sharedSchemas } from "../schemas/shared";

async function middleware(req: Request, res: Response, next: NextFunction) {
  const rawToken = token.get(req);
  const parsedToken = rawToken ? token.parse(rawToken) : undefined;
  if (!parsedToken) return next();

  const tkn = await queryGetToken(req);
  if (!tkn) return next();
  if (!token.compare(parsedToken.validator, tkn.validator)) return next();
  if (date.utc() > tkn.expiresAt) return next();

  res.locals.userId = tkn.userId;
  res.locals.tokenId = tkn.id;

  next();
}

async function auth(req: Request, res: Response<OutputAuthSchema>) {
  const parsed = authSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  if (!getAuthInfo(res)) return void res.status(500).send();
  return void res.status(200).send({});
}

async function initiateSignup(req: Request, res: Response<OutputInitiateSignupSchema>): Promise<void> {
  const parsed = initiateSignupSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const { username, email } = parsed.data;

  const [result0]: [{ count: number }?] = await pg`
    SELECT COUNT(*) FROM users WHERE username=${username} OR email=${email}
  `;
  if (!result0) return void res.status(500).send();
  if (result0.count !== 0) return void res.status(500).send();

  const [result1]: [{ count: number }?] = await pg`
    SELECT COUNT(*) FROM email_verification
    WHERE username=${username} AND email=${email} AND expires_at>${date.utc()} AND tries_left>0
  `;
  if (!result1) return void res.status(500).send();
  if (result1.count !== 0) return void res.status(500).send();
  res.status(200).send({});

  const row = {
    username: username,
    email: email,
    otp: crypto.number(0, 1000000),
    sent_at: -1,
    expires_at: -1,
    tries_left: 3
  }

  const sent = await mailer.sendConfirmEmail(email, row.otp);
  if (!sent) return;

  row.sent_at = date.utc();
  row.expires_at = date.utc() + 60 * 10; // 10 minutes
  await pg`INSERT INTO email_verification ${pg(row)}`;
}

async function confirmSignup(req: Request, res: Response<OutputConfirmSignupSchema>): Promise<void> {
  const parsed = confirmSignupSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const { username, email, password, otp } = parsed.data;

  const [result0]: [{ count: number }?] = await pg`
    SELECT COUNT(*) FROM users WHERE username=${username} OR email=${email}
  `;
  if (!result0) return void res.status(500).send();
  if (result0.count !== 0) return void res.status(500).send();

  const [result1]: [{ id: number, otp: number }?] = await pg`
    UPDATE email_verification SET tries_left=tries_left-1
    WHERE id=(
      SELECT id FROM email_verification
      WHERE username=${username} AND email=${email} AND expires_at>${date.utc()} AND tries_left>0
      ORDER BY id DESC 
      LIMIT 1
    )
    RETURNING id, otp
  `;
  if (!result1) return void res.status(500).send();
  if (result1.otp.toString() !== otp) return void res.status(500).send();

  const row = {
    username: username,
    email: email,
    password: await crypto.encryptPassword(password),
    joined_at: date.utc(),
  }

  const [result2, result3] = await pg.begin(pg => [
    pg`INSERT INTO users ${pg(row)} RETURNING id`,
    pg`UPDATE email_verification SET expires_at=${date.utc()} WHERE id=${result1.id}`,
  ]);
  if (!result2.count) return void res.status(500).send();
  if (!result3.count) return void res.status(500).send();

  const userId: number | undefined = result2[0]?.id;
  if (userId === undefined) return void res.status(500).send();
  if (!await queryCreateToken(req, res, userId)) return void res.status(500).send();
  return void res.status(200).send({});
}

async function login(req: Request, res: Response<OutputLoginSchema>): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const { info, password } = parsed.data;
  const usernameParsed = sharedSchemas.username.safeParse(info);
  const username = usernameParsed.success ? usernameParsed.data : undefined;
  const emailParsed = sharedSchemas.email.safeParse(info);
  const email = emailParsed.success ? emailParsed.data : undefined;

  let [result0]: [{ id: number, email: string, password: Buffer }?] = [undefined];
  if (username) [result0] = await pg`SELECT id, email, password FROM users WHERE username=${username}`;
  else if (email) [result0] = await pg`SELECT id, email, password FROM users WHERE email=${email}`;
  else return void res.status(500).send();

  if (!result0) return void res.status(500).send();
  if (!await crypto.comparePassword(password, result0.password)) return void res.status(500).send();
  if (!await queryCreateToken(req, res, result0.id)) return void res.status(500).send();

  res.status(200).send({});

  const ip = req.ip;
  const ua = userAgent.parse(req.headers["user-agent"]);
  const [result1]: [{ count: number }?] = await pg`
    SELECT COUNT(*) FROM sessions
    WHERE user_id=${result0.id} AND ip=${ip}
  `;
  if (!result1) return;
  if (result1.count > 1) return;

  await mailer.sendNewLocation(result0.email, ip, ua);
}

async function logout(req: Request, res: Response<OutputLogoutSchema>) {
  const parsed = logoutSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const authInfo = getAuthInfo(res);
  if (!authInfo) return void res.status(500).send();
  await queryExpireToken(res, authInfo.tokenId, authInfo.userId);
  return void res.status(200).send({});
}

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
    ip: req.ip
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

export function getAuthInfo(res: Response): undefined | { tokenId: number, userId: number } {
  if (res.locals.tokenId === undefined || res.locals.userId === undefined) return undefined;
  return { tokenId: res.locals.tokenId, userId: res.locals.userId };
}

export default { middleware, auth, initiateSignup, confirmSignup, login, logout, getAuthInfo }