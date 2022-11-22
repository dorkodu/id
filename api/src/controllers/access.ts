import { Request, Response } from "express";

import {
  AccessSchema, getAccessesSchema, grantAccessSchema,
  revokeAccessSchema
} from "../schemas/access";

async function getAccesses(req: Request, res: Response<AccessSchema.OutputGetAccesses>): Promise<void> {
  const parsed = getAccessesSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  res.status(200).send();
}

async function grantAccess(req: Request, res: Response<AccessSchema.OutputGrantAccess>): Promise<void> {
  const parsed = grantAccessSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  res.status(200).send();
}

async function revokeAccess(req: Request, res: Response<AccessSchema.OutputRevokeAccess>): Promise<void> {
  const parsed = revokeAccessSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  res.status(200).send();
}


async function queryCreateAccessToken() {

}

async function queryExpireAccessToken() {

}

async function queryCheckAccessToken() {

}

async function queryCreateAccessCode() {

}

async function queryExpireAccessCode() {

}

async function queryCheckAccessCode() {

}

export default {
  getAccesses,
  grantAccess,
  revokeAccess,

  queryCreateAccessToken,
  queryExpireAccessToken,
  queryCheckAccessToken,
  queryCreateAccessCode,
  queryExpireAccessCode,
  queryCheckAccessCode,
}