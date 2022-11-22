import { Request, Response } from "express";
import { checkAccessSchema, ExternalSchema, getAccessTokenSchema, getUserDataSchema } from "../schemas/external";

async function getAccessToken(req: Request, res: Response<ExternalSchema.OutputGetAccessToken>): Promise<void> {
  const parsed = getAccessTokenSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  res.status(200).send();
}

async function checkAccess(req: Request, res: Response<ExternalSchema.OutputCheckAccess>): Promise<void> {
  const parsed = checkAccessSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  res.status(200).send();
}

async function getUserData(req: Request, res: Response<ExternalSchema.OutputGetUserData>): Promise<void> {
  const parsed = getUserDataSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  res.status(200).send();
}

export default { getAccessToken, checkAccess, getUserData }