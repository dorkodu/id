import { Request, Response } from "express";

import pg from "../pg";
import { changeEmailSchema, ChangePasswordSchema, changeUsernameSchema, getUserSchema } from "../schemas/user";
import auth from "./auth";

async function getUser(req: Request, res: Response<{ username: string, email: string, joinedAt: number }>) {
  const parsed = getUserSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const info = auth.getAuthInfo(res);
  if (!info) return void res.status(500).send();

  const [result]: [{ username: string, email: string, joinedAt: number }?] = await pg`
    SELECT username, email, joinedAt FROM users WHERE id=${info.userId}
  `;
  if (!result) return void res.status(500).send();
  return void res.status(200).send(result);
}

async function changeUsername(req: Request, res: Response) {
  const parsed = changeUsernameSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const result = await pg``;
}

async function changeEmail(req: Request, res: Response) {
  const parsed = changeEmailSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const result = await pg``;
}

async function changePassword(req: Request, res: Response) {
  const parsed = ChangePasswordSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const result = await pg``;
}

export default {
  getUser,

  changeUsername,
  changeEmail,
  changePassword,
}