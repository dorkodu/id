import { NextFunction, Request, Response } from "express";
import { date } from "../lib/date";
import { token } from "../lib/token";

import pg from "../pg";
import { authSchema, loginSchema, logoutSchema, signupSchema } from "../schemas/auth";

async function middleware(req: Request, res: Response, next: NextFunction) {
  const rawToken = token.get(req);
  const parsedToken = rawToken ? token.parse(rawToken) : undefined;
  if (!parsedToken) return next();

  const tkn = await queryGetToken(req);
  if (!tkn) return next();
  if (!token.compare(parsedToken.validator, tkn.validator)) return next();
  if (date.utc() > tkn.expires) { await queryDeleteToken(res, tkn.id, tkn.userId); return next(); }

  res.locals.userId = tkn.userId;
  res.locals.tokenId = tkn.id;

  next();
}

async function auth(req: Request, res: Response<{ userId: number }>) {
  const parsed = authSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  if (!getAuthInfo(res)) return void res.status(500).send();
  return void res.status(200).send({ userId: res.locals.userId as number })
}

async function signup(req: Request, res: Response) {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const result = await pg``;
}

async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();
  if (!parsed.data.username && !parsed.data.email) return void res.status(500).send();
  if (parsed.data.username && parsed.data.email) return void res.status(500).send();

  const result = await pg``;
}

async function logout(req: Request, res: Response) {
  const parsed = logoutSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const authInfo = getAuthInfo(res);
  if (!authInfo) return void res.status(500).send();
  await queryDeleteToken(res, authInfo.tokenId, authInfo.userId);
  return void res.status(200).send();
}

async function queryGetToken(req: Request) {
  const rawToken = token.get(req);
  const parsedToken = rawToken ? token.parse(rawToken) : undefined;
  if (!parsedToken) return undefined;

  const [result]: [{ id: number, userId: number, validator: Buffer, expires: number }?] = await pg`
    SELECT id, userId, validator, expires FROM auth WHERE selector=${parsedToken.selector}
  `;

  return result;
}

async function queryDeleteToken(res: Response, tokenId: number, userId: number) {
  await pg`DELETE FROM auth WHERE id=${tokenId} AND userId=${userId}`;
  res.clearCookie("token");
}

export function getAuthInfo(res: Response): undefined | { tokenId: number, userId: number } {
  if (res.locals.tokenId === undefined || res.locals.userId === undefined) return undefined;
  return { tokenId: res.locals.tokenId, userId: res.locals.userId };
}

export default { middleware, auth, signup, login, logout, getAuthInfo }