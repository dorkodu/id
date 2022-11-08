import { NextFunction, Request, Response } from "express";
import { crypto } from "../lib/crypto";
import { date } from "../lib/date";
import { token } from "../lib/token";
import { userAgent } from "../lib/user_agent";

import pg from "../pg";
import { authSchema, loginSchema, logoutSchema, OutputAuthSchema, OutputLoginSchema, OutputLogoutSchema, OutputSignupSchema, signupSchema } from "../schemas/auth";
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

async function signup(req: Request, res: Response<OutputSignupSchema>) {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const row = {
    username: parsed.data.username,
    email: parsed.data.email,
    password: await crypto.encryptPassword(parsed.data.password),
    joined_at: date.utc(),
  }

  const [result]: [{ id: number }?] = await pg`INSERT INTO users ${pg(row)} RETURNING id`;
  if (!result) return void res.status(500).send();
  if (!await queryCreateToken(req, res, result.id)) return void res.status(500).send();
  return void res.status(200).send({});
}

async function login(req: Request, res: Response<OutputLoginSchema>) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const { info, password } = parsed.data;
  const usernameParsed = sharedSchemas.username.safeParse(info);
  const username = usernameParsed.success ? usernameParsed.data : undefined;
  const emailParsed = sharedSchemas.email.safeParse(info);
  const email = emailParsed.success ? emailParsed.data : undefined;

  let [result]: [{ id: number, password: Buffer }?] = [undefined];
  if (username) [result] = await pg`SELECT id, password FROM users WHERE username=${username}`;
  else if (email) [result] = await pg`SELECT id, password FROM users WHERE email=${email}`;
  else return void res.status(500).send();

  if (!result) return void res.status(500).send();
  if (!await crypto.comparePassword(password, result.password)) return void res.status(500).send();
  if (!await queryCreateToken(req, res, result.id)) return void res.status(500).send();
  return void res.status(200).send({});
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

export default { middleware, auth, signup, login, logout, getAuthInfo }