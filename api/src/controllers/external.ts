import { checkAccessSchema, getAccessTokenSchema, getUserDataSchema } from "../schemas/external";
import sage from "@dorkodu/sage-server";
import { SchemaContext } from "./_schema";
import { z } from "zod";

/* These functions are used by external apps that use Dorkodu ID for authentication. */

const getAccessToken = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof getAccessTokenSchema>,
  async (_arg, _ctx) => {
    return undefined;
  }
)

const checkAccess = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof checkAccessSchema>,
  async (_arg, _ctx) => {
    return undefined;
  }
)

const getUserData = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof getUserDataSchema>,
  async (_arg, _ctx) => {
    return undefined;
  }
)

//async function validateAccessToken(accessToken: string): Promise<{ userId: number } | undefined> {
//  const parsedToken = token.parse(accessToken);
//  if (!parsedToken) return undefined;
//
//  const result0 = await access.queryGetAccessToken(accessToken);
//  if (!result0) return undefined;
//  if (!token.compare(parsedToken.validator, result0.validator)) return undefined;
//  if (date.utc() >= result0.expiresAt) return undefined;
//
//  return { userId: result0.userId };
//}

export default {
  getAccessToken,
  checkAccess,
  getUserData,
}