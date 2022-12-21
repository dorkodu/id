import { checkAccessSchema, getAccessTokenSchema, getUserDataSchema } from "../schemas/external";
import sage from "@dorkodu/sage-server";
import { SchemaContext } from "./_schema";
import { z } from "zod";
import { token } from "../lib/token";
import access from "./access";
import pg from "../pg";
import { IUserParsed, IUserRaw, iUserSchema } from "../types/user";

/* These functions are used by external apps that use Dorkodu ID for authentication. */

const getAccessToken = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof getAccessTokenSchema>,
  async (arg, _ctx): Promise<{ token: string } | undefined> => {
    const parsed = getAccessTokenSchema.safeParse(arg);
    if (!parsed.success) return undefined;

    const parsedToken = token.parse(parsed.data.code);
    if (!parsedToken) return undefined;

    const result0 = await access.queryGetAccessCode(parsed.data.code);
    if (!result0) return undefined;
    if (!token.check(result0, parsedToken.validator)) return undefined;

    const { userId, userAgent, ip, service } = result0;

    const accessToken = await access.queryCreateAccessToken(userId, userAgent, ip, service);
    if (!accessToken) return undefined;

    return { token: accessToken };
  }
)

const checkAccess = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof checkAccessSchema>,
  async (arg, _ctx): Promise<{ userId: string } | undefined> => {
    const parsed = checkAccessSchema.safeParse(arg);
    if (!parsed.success) return undefined;

    return await validateAccessToken(parsed.data.token);
  }
)

const getUserData = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof getUserDataSchema>,
  async (arg, _ctx): Promise<IUserParsed | undefined> => {
    const parsed = getUserDataSchema.safeParse(arg);
    if (!parsed.success) return undefined;

    const result0 = await validateAccessToken(parsed.data.token);
    if (!result0) return undefined;

    const [result]: [IUserRaw?] = await pg`
      SELECT id, username, email, joined_at FROM users WHERE id=${result0.userId}
    `;
    const userParsed = iUserSchema.safeParse(result);
    if (!userParsed.success) return undefined;

    return userParsed.data;
  }
)

async function validateAccessToken(accessToken: string) {
  const parsedToken = token.parse(accessToken);
  if (!parsedToken) return undefined;

  const result = await access.queryGetAccessToken(accessToken);
  if (!result) return undefined;
  if (!token.check(result, parsedToken.validator)) return undefined;

  return { userId: result.userId };
}

export default {
  getAccessToken,
  checkAccess,
  getUserData,
}