import { Request, Response } from "express";

import pg from "../pg";
import { checkSchema, grantSchema, revokeSchema } from "../schemas/access";

async function check(req: Request, res: Response) {
  const parsed = checkSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const result = await pg``;
}

async function grant(req: Request, res: Response) {
  const parsed = grantSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const result = await pg``;
}

async function revoke(req: Request, res: Response) {
  const parsed = revokeSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const result = await pg``;
}

export default { check, grant, revoke }