import { IUser } from "../../../shared/src/user";
import { date } from "../lib/date";
import { token } from "../lib/token";
import pg from "../pg";
import { checkAccessSchema, getAccessTokenSchema, getUserDataSchema } from "../schemas/external";
import access from "./access";
import sage from "@dorkodu/sage-server";
import { RouterContext } from "./_router";
import { z } from "zod";

/* These functions are used by external apps that use Dorkodu ID for authentication. */

const getAccessToken = sage.route(
  {} as RouterContext,
  {} as z.infer<typeof getAccessTokenSchema>,
  async (input, _ctx) => {
    const parsed = getAccessTokenSchema.safeParse(input);
    if (!parsed.success) return undefined;

    const parsedToken = token.parse(parsed.data.code);
    if (!parsedToken) return undefined;

    const result0 = await access.queryGetAccessCode(parsed.data.code);
    if (!result0) return undefined;
    if (!token.compare(parsedToken.validator, result0.validator)) return undefined;
    if (date.utc() >= result0.expiresAt) return undefined;

    const { userId, userAgent, ip, service } = result0;

    const accessToken = await access.queryCreateAccessToken(userId, userAgent, ip, service);
    if (!accessToken) return undefined;

    return { token: accessToken };
  }
)

const checkAccess = sage.route(
  {} as RouterContext,
  {} as z.infer<typeof checkAccessSchema>,
  async (input, _ctx) => {
    const parsed = checkAccessSchema.safeParse(input);
    if (!parsed.success) return undefined;

    const result0 = await validateAccessToken(parsed.data.token);
    if (!result0) return undefined;
    return { userId: result0.userId };
  }
)

const getUserData = sage.route(
  {} as RouterContext,
  {} as z.infer<typeof getUserDataSchema>,
  async (input, _ctx) => {
    const parsed = getUserDataSchema.safeParse(input);
    if (!parsed.success) return undefined;

    const result0 = await validateAccessToken(parsed.data.token);
    if (!result0) return undefined;

    const [result]: [IUser?] = await pg`
      SELECT id, username, email, joined_at FROM users WHERE id=${result0.userId}
    `;
    if (!result) return undefined;
    return result;
  }
)

async function validateAccessToken(accessToken: string): Promise<{ userId: number } | undefined> {
  const parsedToken = token.parse(accessToken);
  if (!parsedToken) return undefined;

  const result0 = await access.queryGetAccessToken(accessToken);
  if (!result0) return undefined;
  if (!token.compare(parsedToken.validator, result0.validator)) return undefined;
  if (date.utc() >= result0.expiresAt) return undefined;

  return { userId: result0.userId };
}

export default {
  getAccessToken,
  checkAccess,
  getUserData,
}