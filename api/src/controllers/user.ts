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
import { mailer } from "../lib/mailer";
import { emailTypes } from "../types/types";

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

  const [result0]: [{ email: string }?] = await pg`
    SELECT email FROM users WHERE id=${info.userId}
  `;
  if (!result0) return;
  if (result0.email === parsed.data.newEmail) return;

  const [result1]: [{ count: number }?] = await pg`
    SELECT COUNT(*) FROM security_verification 
    WHERE user_id=${info.userId} AND issued_at>${date.utc() - 60 * 60} AND type=${emailTypes.confirmEmailChange}
  `;
  if (!result1) return;
  if (result1.count >= 3) return;

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
    type: emailTypes.confirmEmailChange,
  }

  const sent = await mailer.sendConfirmEmailChange(newEmail, tkn.full);
  if (!sent) return;

  row.sent_at = date.utc();
  row.expires_at = date.utc() + 60 * 60; // 1 hour
  await pg`INSERT INTO security_verification ${pg(row)}`;
}

async function confirmEmailChange(req: Request, res: Response<OutputConfirmEmailChangeSchema>): Promise<void> {
  const parsed = confirmEmailChangeSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const tkn0 = token.parse(parsed.data.token);
  if (!tkn0) return void res.status(500).send();

  const [result0]: [{ userId: number, email: string, validator: Buffer, issuedAt: number, expiresAt: number }?] = await pg`
    SELECT user_id, email, validator, issued_at, expires_at FROM security_verification
    WHERE selector=${tkn0.selector}
  `;
  if (!result0) return void res.status(500).send();
  if (date.utc() > result0.expiresAt) return void res.status(500).send();
  if (!token.compare(tkn0.validator, result0.validator)) return void res.status(500).send();

  const [result1]: [{ email: string }?] = await pg` SELECT email FROM users WHERE id=${result0.userId}`;
  if (!result1) return void res.status(500).send();
  if (result1.email === result0.email) return void res.status(500).send();

  const [result2]: [{ count: number }?] = await pg`
    SELECT COUNT(*) FROM security_verification
    WHERE user_id=${result0.userId} AND issued_at>${result0.issuedAt} AND type=${emailTypes.confirmEmailChange}
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
    type: emailTypes.revertEmailChange,
  }

  const sent = await mailer.sendRevertEmailChange(oldEmail, tkn1.full);
  if (!sent) return void res.status(500).send();

  row.sent_at = date.utc();
  row.expires_at = date.utc() + 60 * 60 * 24 * 30; // 30 days
  const [result3, result4] = await pg.begin(pg => [
    pg`INSERT INTO security_verification ${pg(row)}`,
    pg`UPDATE users SET email=${result0.email} WHERE id=${result0.userId}`
  ]);
  if (!result3.count) return void res.status(500).send();
  if (!result4.count) return void res.status(500).send();

  res.status(200).send({});
}

async function revertEmailChange(req: Request, res: Response<OutputRevertEmailChangeSchema>): Promise<void> {
  const parsed = revertEmailChangeSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const tkn0 = token.parse(parsed.data.token);
  if (!tkn0) return void res.status(500).send();

  const [result0]: [{ userId: number, email: string, validator: Buffer, issuedAt: number, expiresAt: number }?] = await pg`
    SELECT user_id, email, validator, issued_at, expires_at FROM security_verification
    WHERE selector=${tkn0.selector}
  `;
  if (!result0) return void res.status(500).send();
  if (date.utc() > result0.expiresAt) return void res.status(500).send();
  if (!token.compare(tkn0.validator, result0.validator)) return void res.status(500).send();

  const [result1]: [{ email: string }?] = await pg` SELECT email FROM users WHERE id=${result0.userId}`;
  if (!result1) return void res.status(500).send();
  if (result1.email === result0.email) return void res.status(500).send();

  const [result2]: [{ count: number }?] = await pg`
    SELECT COUNT(*) FROM security_verification
    WHERE user_id=${result0.userId} AND issued_at>${result0.issuedAt} AND type=${emailTypes.revertEmailChange}
  `;
  if (!result2) return void res.status(500).send();
  if (result2.count !== 0) return void res.status(500).send();

  const result3 = await pg`
    UPDATE users SET email=${result0.email} WHERE id=${result0.userId}
  `;
  if (!result3.count) return void res.status(500).send();

  res.status(200).send({});
}

async function initiatePasswordChange(req: Request, res: Response<OutputInitiatePasswordChangeSchema>): Promise<void> {
  const parsed = initiatePasswordChangeSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();
  res.status(200).send({});

  const { username, email } = parsed.data;

  const [result0]: [{ id: number }?] = await pg`
    SELECT id FROM users WHERE username=${username} AND email=${email}
  `;
  if (!result0) return;

  const [result1]: [{ count: number }?] = await pg`
    SELECT COUNT(*) FROM security_verification
    WHERE user_id=${result0.id} AND issued_at>${date.utc() - 60 * 60} AND type=${emailTypes.confirmPasswordChange}
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
    type: emailTypes.confirmPasswordChange,
  }

  const sent = await mailer.sendConfirmPasswordChange(email, tkn.full);
  if (!sent) return;

  row.sent_at = date.utc();
  row.expires_at = date.utc() + 60 * 60; // 1 hour
  await pg`INSERT INTO security_verification ${pg(row)}`;
}

async function confirmPasswordChange(req: Request, res: Response<OutputConfirmPasswordChangeSchema>): Promise<void> {
  const parsed = confirmPasswordChangeSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const tkn = token.parse(parsed.data.token);
  if (!tkn) return void res.status(500).send();

  const [result0]: [{ userId: number, email: string, validator: Buffer, issuedAt: number, expiresAt: number }?] = await pg`
    SELECT user_id, email, validator, issued_at, expires_at FROM security_verification
    WHERE selector=${tkn.selector}
  `;
  if (!result0) return void res.status(500).send();
  if (date.utc() > result0.expiresAt) return void res.status(500).send();
  if (!token.compare(tkn.validator, result0.validator)) return void res.status(500).send();

  const [result1]: [{ email: string }?] = await pg` SELECT email FROM users WHERE id=${result0.userId}`;
  if (!result1) return void res.status(500).send();
  if (result1.email !== result0.email) return void res.status(500).send();

  const [result2]: [{ count: number }?] = await pg`
    SELECT COUNT(*) FROM security_verification
    WHERE user_id=${result0.userId} AND issued_at>${result0.issuedAt} AND type=${emailTypes.confirmPasswordChange}
  `;
  if (!result2) return void res.status(500).send();
  if (result2.count !== 0) return void res.status(500).send();

  const password = await crypto.encryptPassword(parsed.data.newPassword);
  const [result3, result4] = await pg.begin(pg => [
    pg`UPDATE users SET password=${password}`,
    pg`UPDATE sessions SET expires_at=${date.utc()} WHERE user_id=${result0.userId} AND expires_at>${date.utc()}`,
  ])
  if (!result3.count) return void res.status(500).send();
  if (!result4.count) return void res.status(500).send();

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