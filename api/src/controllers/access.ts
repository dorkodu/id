import { Request, Response } from "express";

import _pg from "../pg";
import { checkAccessSchema, grantAccessSchema, OutputCheckAccessSchema, OutputGetAccessesSchema, OutputGrantAccessSchema, OutputRevokeAccessSchema, revokeAccessSchema } from "../schemas/access";

async function getAccesses(req: Request, res: Response<OutputGetAccessesSchema>) {
  const parsed = checkAccessSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();
  return void res.status(200).send({});
}

async function checkAccess(req: Request, res: Response<OutputCheckAccessSchema>) {
  const parsed = checkAccessSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();
  return void res.status(200).send({});
}

async function grantAccess(req: Request, res: Response<OutputGrantAccessSchema>) {
  const parsed = grantAccessSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();
  return void res.status(200).send({});
}

async function revokeAccess(req: Request, res: Response<OutputRevokeAccessSchema>) {
  const parsed = revokeAccessSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();
  return void res.status(200).send({});
}

export default { getAccesses, checkAccess, grantAccess, revokeAccess }