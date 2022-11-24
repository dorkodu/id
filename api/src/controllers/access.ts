import { Request, Response } from "express";
import { IAccess } from "../../../shared/src/access";
import { crypto } from "../lib/crypto";
import { date } from "../lib/date";
import { token } from "../lib/token";
import { userAgent } from "../lib/user_agent";
import pg from "../pg";

import {
  AccessSchema, getAccessesSchema, grantAccessSchema,
  revokeAccessSchema
} from "../schemas/access";
import auth from "./auth";

async function getAccesses(req: Request, res: Response<AccessSchema.OutputGetAccesses>): Promise<void> {
  const parsed = getAccessesSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const info = auth.getAuthInfo(res);
  if (!info) return void res.status(500).send();

  const { anchor, type } = parsed.data;
  const result = await pg<IAccess[]>`
    SELECT id, created_at, expires_at, user_agent, ip, service FROM access_tokens
    WHERE user_id=${info.userId} AND expires_at>${date.utc()}
    ${anchor === -1 ? pg`` : type === "newer" ? pg`AND id>${anchor}` : pg`AND id<${anchor}`}
    ORDER BY id ${anchor === -1 ? pg`DESC` : type === "newer" ? pg`ASC` : pg`DESC`}
    LIMIT 10
  `;
  if (!result.length) return void res.status(500).send();

  return void res.status(200).send(result);
}

async function grantAccess(req: Request, res: Response<AccessSchema.OutputGrantAccess>): Promise<void> {
  const parsed = grantAccessSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const info = auth.getAuthInfo(res);
  if (!info) return void res.status(500).send();

  const code = await queryCreateAccessCode(req, info.userId, parsed.data.service);
  if (!code) return void res.status(500).send();

  res.status(200).send({ code });
}

async function revokeAccess(req: Request, res: Response<AccessSchema.OutputRevokeAccess>): Promise<void> {
  const parsed = revokeAccessSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const info = auth.getAuthInfo(res);
  if (!info) return void res.status(500).send();

  res.status(200).send({});
}


async function queryCreateAccessToken() {

}

async function queryExpireAccessToken() {

}

async function queryCheckAccessToken() {

}

async function queryCreateAccessCode(req: Request, userId: number, service: string): Promise<string | undefined> {
  const tkn = token.create();

  const row = {
    user_id: userId,
    selector: tkn.selector,
    validator: crypto.sha256(tkn.validator),
    created_at: tkn.createdAt,
    expires_at: tkn.createdAt + 60,
    user_agent: userAgent.parse(req.headers["user-agent"]),
    ip: req.ip,
    service: service,
  }

  const result = await pg`INSERT INTO sessions ${pg(row)}`;
  if (!result.count) return undefined;

  return tkn.full;
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