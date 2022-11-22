import { Request, Response } from "express";

import {
  AccessSchema, checkAccessSchema, getAccessesSchema, getUserDataSchema, grantAccessSchema,
  revokeAccessSchema
} from "../schemas/access";

async function getAccesses(req: Request, res: Response<AccessSchema.OutputGetAccesses>) {
  const parsed = getAccessesSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();
  return void res.status(200).send();
}

async function checkAccess(req: Request, res: Response<AccessSchema.OutputCheckAccess>) {
  const parsed = checkAccessSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();
  return void res.status(200).send();
}

async function grantAccess(req: Request, res: Response<AccessSchema.OutputGrantAccess>) {
  const parsed = grantAccessSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();
  return void res.status(200).send();
}

async function revokeAccess(req: Request, res: Response<AccessSchema.OutputRevokeAccess>) {
  const parsed = revokeAccessSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();
  return void res.status(200).send();
}

async function getUser(req: Request, res: Response<AccessSchema.OutputGetUserData>) {
  const parsed = getUserDataSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();
  return void res.status(200).send();
}

export default { getAccesses, checkAccess, grantAccess, revokeAccess, getUser }