import { Request, Response } from "express";
import { crypto } from "../lib/crypto";

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

  const info = auth.getAuthInfo(res);
  if (!info) return void res.status(500).send();

  const { newUsername } = parsed.data;
  const [result]: [{ username: string }?] = await pg`
    UPDATE users SET username=${newUsername} WHERE id=${info.userId} RETURNING username
  `;
  if (!result) return void res.status(500).send();
  return void res.status(200).send();
}

async function changeEmail(req: Request, res: Response) {
  const parsed = changeEmailSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const info = auth.getAuthInfo(res);
  if (!info) return void res.status(500).send();

  const { newEmail, password } = parsed.data;

  const [result0]: [{ password: Buffer }?] = await pg`
    SELECT password FROM users WHERE id=${info.userId}
  `;
  if (!result0) return void res.status(500).send();
  if (!crypto.comparePassword(password, result0.password)) return void res.status(500).send();

  const [result1]: [{ email: string }?] = await pg`
    UPDATE users SET email=${newEmail} WHERE id=${info.userId} RETURNING email
  `;
  if (!result1) return void res.status(500).send();
  return void res.status(200).send();
}

async function changePassword(req: Request, res: Response) {
  const parsed = ChangePasswordSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const info = auth.getAuthInfo(res);
  if (!info) return void res.status(500).send();

  const oldPassword = parsed.data.oldPassword;
  const newPassword = await crypto.encryptPassword(parsed.data.newPassword);

  const [result0]: [{ password: Buffer }?] = await pg`
    SELECT password FROM users WHERE id=${info.userId}
  `;
  if (!result0) return void res.status(500).send();
  if (!crypto.comparePassword(oldPassword, result0.password)) return void res.status(500).send();

  const [result1]: [{ password: string }?] = await pg`
    UPDATE users SET password=${newPassword} WHERE id=${info.userId} RETURNING password
  `;
  if (!result1) return void res.status(500).send();
  return void res.status(200).send();
}

export default {
  getUser,

  changeUsername,
  changeEmail,
  changePassword,
}