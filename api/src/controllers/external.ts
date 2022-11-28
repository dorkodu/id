import { Request, Response } from "express";
import { IUser } from "../../../shared/src/user";
import { date } from "../lib/date";
import { token } from "../lib/token";
import pg from "../pg";
import { checkAccessSchema, ExternalSchema, getAccessTokenSchema, getUserDataSchema } from "../schemas/external";
import access from "./access";

/* These functions are used by external apps that use Dorkodu ID for authentication. */

async function getAccessToken(req: Request, res: Response<ExternalSchema.OutputGetAccessToken>): Promise<void> {
  const parsed = getAccessTokenSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const parsedToken = token.parse(parsed.data.code);
  if (!parsedToken) return void res.status(500).send();

  const result0 = await access.queryGetAccessCode(parsed.data.code);
  if (!result0) return void res.status(500).send();
  if (!token.compare(parsedToken.validator, result0.validator)) return void res.status(500).send();
  if (date.utc() > result0.expiresAt) return void res.status(500).send();

  const { userId, userAgent, ip, service } = result0;

  const accessToken = await access.queryCreateAccessToken(userId, userAgent, ip, service);
  if (!accessToken) return void res.status(500).send();

  res.status(200).send({ token: accessToken });
}

async function checkAccess(req: Request, res: Response<ExternalSchema.OutputCheckAccess>): Promise<void> {
  const parsed = checkAccessSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const result0 = await validateAccessToken(parsed.data.token);
  if (!result0) return void res.status(500).send();
  res.status(200).send({ userId: result0.userId });
}

async function getUserData(req: Request, res: Response<ExternalSchema.OutputGetUserData>): Promise<void> {
  const parsed = getUserDataSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const result0 = await validateAccessToken(parsed.data.token);
  if (!result0) return void res.status(500).send();

  const [result]: [IUser?] = await pg`
    SELECT id, username, email, joined_at FROM users WHERE id=${result0.userId}
  `;
  if (!result) return void res.status(500).send();
  res.status(200).send(result);
}

async function validateAccessToken(accessToken: string): Promise<{ userId: number } | undefined> {
  const parsedToken = token.parse(accessToken);
  if (!parsedToken) return undefined;

  const result0 = await access.queryGetAccessToken(accessToken);
  if (!result0) return undefined;
  if (!token.compare(parsedToken.validator, result0.validator)) return undefined;
  if (date.utc() > result0.expiresAt) return undefined;

  return { userId: result0.userId };
}

export default { getAccessToken, checkAccess, getUserData }