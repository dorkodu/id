import { Request, Response } from "express";

import pg from "../pg";
import { IUser } from "../types/user";
import auth from "./auth";

import {
  changeUsernameSchema,
  confirmEmailChangeSchema,
  confirmPasswordChangeSchema,
  getUserSchema,
  initiateEmailChangeSchema,
  initiatePasswordChangeSchema,
  OutputChangeUsernameSchema,
  OutputConfirmEmailChangeSchema,
  OutputConfirmPasswordChangeSchema,
  OutputGetUserSchema,
  OutputInitiateEmailChangeSchema,
  OutputInitiatePasswordChangeSchema,
  OutputRevertEmailChangeSchema,
  revertEmailChangeSchema
} from "../schemas/user";
import { token } from "../lib/token";
import { crypto } from "../lib/crypto";
import { date } from "../lib/date";
import { EmailType } from "../types/email_type";
import { mailer } from "../lib/mailer";

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

async function initiateEmailChange(req: Request, res: Response<OutputInitiateEmailChangeSchema>): Promise<void> {
  const parsed = initiateEmailChangeSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const info = auth.getAuthInfo(res);
  if (!info) return void res.status(500).send();

  res.status(200).send({});

  const [result]: [{ email: string }?] = await pg`
    SELECT email FROM users WHERE id=${info.userId}
  `;
  if (!result) return;

  const timestamp = date.utc();

  const newEmail = parsed.data.newEmail;
  const tkn0 = token.create();
  const row0 = {
    user_id: info.userId,
    email: newEmail,
    selector: tkn0.selector,
    validator: crypto.sha256(tkn0.validator),
    issued_at: timestamp,
    sent_at: -1,
    expires_at: -1,
    type: EmailType.ConfirmEmailChange,
  }

  const oldEmail = result.email;
  const tkn1 = token.create();
  const row1 = {
    user_id: info.userId,
    email: oldEmail,
    selector: tkn1.selector,
    validator: crypto.sha256(tkn1.validator),
    issued_at: timestamp,
    sent_at: -1,
    expires_at: -1,
    type: EmailType.RevertEmailChange,
  }

  const [id0, id1]: [{ id: number }?, { id: number }?] = await pg`
    INSERT INTO security_verification ${pg([row0, row1])} RETURNING id
  `;
  if (id0 === undefined || id1 === undefined) return;

  const sent0 = await mailer.sendConfirmEmailChange(newEmail, [id0.id, id1.id], tkn0.full);
  if (!sent0) return;
  const sent1 = await mailer.sendRevertEmailChange(oldEmail, [id0.id, id1.id], tkn1.full);
  if (!sent1) return;
}

async function confirmEmailChange(req: Request, res: Response<OutputConfirmEmailChangeSchema>): Promise<void> {
  const parsed = confirmEmailChangeSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();
}

async function revertEmailChange(req: Request, res: Response<OutputRevertEmailChangeSchema>): Promise<void> {
  const parsed = revertEmailChangeSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();
}

async function initiatePasswordChange(req: Request, res: Response<OutputInitiatePasswordChangeSchema>): Promise<void> {
  const parsed = initiatePasswordChangeSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();
}

async function confirmPasswordChange(req: Request, res: Response<OutputConfirmPasswordChangeSchema>): Promise<void> {
  const parsed = confirmPasswordChangeSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();
}

export default {
  getUser,

  changeUsername,

  initiateEmailChange,
  confirmEmailChange,
  revertEmailChange,

  initiatePasswordChange,
  confirmPasswordChange,
}