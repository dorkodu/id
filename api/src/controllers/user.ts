import { Request, Response } from "express";
import { crypto } from "../lib/crypto";

import pg from "../pg";
import { changeUsernameSchema, getUserSchema, OutputChangeUsernameSchema, OutputGetUserSchema } from "../schemas/user";
import { IUser } from "../types/user";
import auth from "./auth";

async function getUser(req: Request, res: Response<OutputGetUserSchema>) {
  const parsed = getUserSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const info = auth.getAuthInfo(res);
  if (!info) return void res.status(500).send();

  const [result]: [IUser?] = await pg`
    SELECT username, email, joined_at FROM users WHERE id=${info.userId}
  `;
  if (!result) return void res.status(500).send();
  return void res.status(200).send(result);
}

async function changeUsername(req: Request, res: Response<OutputChangeUsernameSchema>) {
  const parsed = changeUsernameSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const info = auth.getAuthInfo(res);
  if (!info) return void res.status(500).send();

  const { newUsername } = parsed.data;
  const result = await pg`UPDATE users SET username=${newUsername} WHERE id=${info.userId}`;
  if (!result.count) return void res.status(500).send();
  return void res.status(200).send({});
}

async function initiateChangeEmail() {

}

async function verifyNewEmailChangeEmail() {

}

async function verifyOldEmailChangeEmail() {

}

async function initiateChangePassword() {

}

async function proceedChangePassword() {

}

async function completeChangePassword() {

}

export default {
  getUser,

  changeUsername,

  initiateChangeEmail,
  verifyNewEmailChangeEmail,
  verifyOldEmailChangeEmail,

  initiateChangePassword,
  proceedChangePassword,
  completeChangePassword,
}