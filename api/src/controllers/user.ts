import { Request, Response } from "express";

import { IUser } from "../../../shared/src/user";
import pg from "../pg";
import auth from "./auth";

import { crypto } from "../lib/crypto";
import { date } from "../lib/date";
import { mailer } from "../lib/mailer";
import { token } from "../lib/token";
import {
  changeUsernameSchema,
  confirmEmailChangeSchema,
  confirmPasswordChangeSchema,
  getUserSchema,
  initiateEmailChangeSchema,
  initiatePasswordChangeSchema,
  revertEmailChangeSchema,
  UserSchema
} from "../schemas/user";

async function getUser(req: Request, res: Response<UserSchema.OutputGetUser>) {
  const parsed = getUserSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const info = auth.getAuthInfo(res);
  if (!info) return void res.status(500).send();

  const [result]: [IUser?] = await pg`
    SELECT id, username, email, joined_at FROM users WHERE id=${info.userId}
  `;
  if (!result) return void res.status(500).send();
  return void res.status(200).send(result);
}

async function changeUsername(req: Request, res: Response<UserSchema.OutputChangeUsername>) {
  const parsed = changeUsernameSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const info = auth.getAuthInfo(res);
  if (!info) return void res.status(500).send();

  const { newUsername } = parsed.data;
  const result = await pg`UPDATE users SET username=${newUsername} WHERE id=${info.userId}`;
  if (!result.count) return void res.status(500).send();
  return void res.status(200).send({});
}

async function initiateEmailChange(req: Request, res: Response<UserSchema.OutputInitiateEmailChange>): Promise<void> {
  const parsed = initiateEmailChangeSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const info = auth.getAuthInfo(res);
  if (!info) return void res.status(500).send();

  const [result0]: [{ email: string }?] = await pg`
    SELECT email FROM users WHERE id=${info.userId}
  `;
  if (!result0) return void res.status(500).send();
  if (result0.email === parsed.data.newEmail) return void res.status(500).send();

  const [result1]: [{ count: number }?] = await pg`
    SELECT COUNT(*) FROM email_confirm_email 
    WHERE user_id=${info.userId} AND issued_at>${date.utc() - 60 * 60}
  `;
  if (!result1) return void res.status(500).send();
  if (result1.count >= 3) return void res.status(500).send();

  const newEmail = parsed.data.newEmail;
  const tkn = token.create();
  const row = {
    user_id: info.userId,
    email: newEmail,
    selector: tkn.selector,
    validator: crypto.sha256(tkn.validator),
    issued_at: date.utc(),
    sent_at: -1,
    expires_at: -1,
  }

  const sent = await mailer.sendConfirmEmailChange(newEmail, tkn.full);
  if (!sent) return void res.status(500).send();

  row.sent_at = date.utc();
  row.expires_at = date.utc() + 60 * 60; // 1 hour
  await pg`INSERT INTO email_confirm_email ${pg(row)}`;

  res.status(200).send({});
}

async function confirmEmailChange(req: Request, res: Response<UserSchema.OutputConfirmEmailChange>): Promise<void> {
  const parsed = confirmEmailChangeSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const tkn0 = token.parse(parsed.data.token);
  if (!tkn0) return void res.status(500).send();

  const [result0]: [{ id: number, userId: number, email: string, validator: Buffer, expiresAt: number }?] = await pg`
    SELECT id, user_id, email, validator, issued_at, expires_at FROM email_confirm_email
    WHERE selector=${tkn0.selector}
  `;
  if (!result0) return void res.status(500).send();
  if (date.utc() >= result0.expiresAt) return void res.status(500).send();
  if (!token.compare(tkn0.validator, result0.validator)) return void res.status(500).send();

  const [result1]: [{ email: string }?] = await pg` SELECT email FROM users WHERE id=${result0.userId}`;
  if (!result1) return void res.status(500).send();
  if (result1.email === result0.email) return void res.status(500).send();

  const [result2]: [{ count: number }?] = await pg`
    SELECT COUNT(*) FROM email_confirm_email
    WHERE id>${result0.id} AND user_id=${result0.userId}
  `;
  if (!result2) return void res.status(500).send();
  if (result2.count !== 0) return void res.status(500).send();

  const oldEmail = result1.email;
  const tkn1 = token.create();
  const row = {
    user_id: result0.userId,
    email: oldEmail,
    selector: tkn1.selector,
    validator: crypto.sha256(tkn1.validator),
    issued_at: date.utc(),
    sent_at: -1,
    expires_at: -1,
  }

  const sent = await mailer.sendRevertEmailChange(oldEmail, tkn1.full);
  if (!sent) return void res.status(500).send();

  row.sent_at = date.utc();
  row.expires_at = date.utc() + 60 * 60 * 24 * 30; // 30 days
  const [result3, result4, result5] = await pg.begin(pg => [
    pg`INSERT INTO email_revert_email ${pg(row)}`,
    pg`UPDATE users SET email=${result0.email} WHERE id=${result0.userId}`,
    pg`UPDATE email_confirm_email SET expires_at=${date.utc()} WHERE id=${result0.id}`
  ]);
  if (!result3.count) return void res.status(500).send();
  if (!result4.count) return void res.status(500).send();
  if (!result5.count) return void res.status(500).send();

  res.status(200).send({});
}

async function revertEmailChange(req: Request, res: Response<UserSchema.OutputRevertEmailChange>): Promise<void> {
  const parsed = revertEmailChangeSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const tkn0 = token.parse(parsed.data.token);
  if (!tkn0) return void res.status(500).send();

  const [result0]: [{ id: number, userId: number, email: string, validator: Buffer, expiresAt: number }?] = await pg`
    SELECT id, user_id, email, validator, expires_at FROM email_revert_email
    WHERE selector=${tkn0.selector}
  `;
  if (!result0) return void res.status(500).send();
  if (date.utc() >= result0.expiresAt) return void res.status(500).send();
  if (!token.compare(tkn0.validator, result0.validator)) return void res.status(500).send();

  const [result1]: [{ email: string }?] = await pg` SELECT email FROM users WHERE id=${result0.userId}`;
  if (!result1) return void res.status(500).send();
  if (result1.email === result0.email) return void res.status(500).send();

  const [result2, result3, _result4] = await pg.begin(pg => [
    pg`UPDATE users SET email=${result0.email} WHERE id=${result0.userId}`,
    pg`UPDATE email_revert_email SET expires_at=${date.utc()} WHERE id=${result0.id}`,
    pg`UPDATE email_revert_email SET expires_at=${date.utc()} 
       WHERE id>${result0.id} AND user_id=${result0.userId}`
  ]);
  if (!result2.count) return void res.status(500).send();
  if (!result3.count) return void res.status(500).send();

  res.status(200).send({});
}

async function initiatePasswordChange(req: Request, res: Response<UserSchema.OutputInitiatePasswordChange>): Promise<void> {
  const parsed = initiatePasswordChangeSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();
  res.status(200).send({});

  const { username, email } = parsed.data;

  const [result0]: [{ id: number }?] = await pg`
    SELECT id FROM users WHERE username=${username} AND email=${email}
  `;
  if (!result0) return;

  const [result1]: [{ count: number }?] = await pg`
    SELECT COUNT(*) FROM email_change_password
    WHERE user_id=${result0.id} AND issued_at>${date.utc() - 60 * 60}
  `;
  if (!result1) return;
  if (result1.count >= 3) return;

  const tkn = token.create();
  const row = {
    user_id: result0.id,
    email: email,
    selector: tkn.selector,
    validator: crypto.sha256(tkn.validator),
    issued_at: date.utc(),
    sent_at: -1,
    expires_at: -1,
  }

  const sent = await mailer.sendConfirmPasswordChange(email, tkn.full);
  if (!sent) return;

  row.sent_at = date.utc();
  row.expires_at = date.utc() + 60 * 60; // 1 hour
  await pg`INSERT INTO email_change_password ${pg(row)}`;
}

async function confirmPasswordChange(req: Request, res: Response<UserSchema.OutputConfirmPasswordChange>): Promise<void> {
  const parsed = confirmPasswordChangeSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const tkn = token.parse(parsed.data.token);
  if (!tkn) return void res.status(500).send();

  const [result0]: [{ id: number, userId: number, email: string, validator: Buffer, expiresAt: number }?] = await pg`
    SELECT id, user_id, email, validator, expires_at FROM email_change_password
    WHERE selector=${tkn.selector}
  `;
  if (!result0) return void res.status(500).send();
  if (date.utc() >= result0.expiresAt) return void res.status(500).send();
  if (!token.compare(tkn.validator, result0.validator)) return void res.status(500).send();

  const [result1]: [{ email: string }?] = await pg` SELECT email FROM users WHERE id=${result0.userId}`;
  if (!result1) return void res.status(500).send();
  if (result1.email !== result0.email) return void res.status(500).send();

  const [result2]: [{ count: number }?] = await pg`
    SELECT COUNT(*) FROM email_change_password
    WHERE id>${result0.id} AND user_id=${result0.userId}
  `;
  if (!result2) return void res.status(500).send();
  if (result2.count !== 0) return void res.status(500).send();

  const password = await crypto.encryptPassword(parsed.data.newPassword);
  const [result3, _result4, result5] = await pg.begin(pg => [
    pg`UPDATE users SET password=${password} WHERE id=${result0.userId}`,
    pg`UPDATE sessions SET expires_at=${date.utc()} WHERE user_id=${result0.userId} AND expires_at>${date.utc()}`,
    pg`UPDATE email_change_password SET expires_at=${date.utc()} WHERE id=${result0.id}`
  ])
  if (!result3.count) return void res.status(500).send();
  if (!result5.count) return void res.status(500).send();

  res.status(200).send({});
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