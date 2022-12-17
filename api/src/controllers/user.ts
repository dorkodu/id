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
  initiateEmailChangeSchema,
  initiatePasswordChangeSchema,
  revertEmailChangeSchema
} from "../schemas/user";
import sage from "@dorkodu/sage-server";
import { SchemaContext } from "./_schema";
import { z } from "zod";

const getUser = sage.resource(
  {} as SchemaContext,
  undefined,
  async (_arg, ctx) => {
    const info = await auth.getAuthInfo(ctx);
    if (!info) return undefined;

    const [result]: [IUser?] = await pg`
      SELECT id, username, email, joined_at FROM users WHERE id=${info.userId}
    `;
    if (!result) return undefined;
    return result;
  }
)

const changeUsername = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof changeUsernameSchema>,
  async (arg, ctx) => {
    const parsed = changeUsernameSchema.safeParse(arg);
    if (!parsed.success) return undefined;

    const info = await auth.getAuthInfo(ctx);
    if (!info) return undefined;

    const { newUsername } = parsed.data;
    const result = await pg`UPDATE users SET username=${newUsername} WHERE id=${info.userId}`;
    if (!result.count) return undefined;
    return {};
  }
)

const initiateEmailChange = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof initiateEmailChangeSchema>,
  async (arg, ctx) => {
    const parsed = initiateEmailChangeSchema.safeParse(arg);
    if (!parsed.success) return undefined;

    const info = await auth.getAuthInfo(ctx);
    if (!info) return undefined;

    const [result0]: [{ email: string }?] = await pg`
      SELECT email FROM users WHERE id=${info.userId}
    `;
    if (!result0) return undefined;
    if (result0.email === parsed.data.newEmail) return undefined;

    const [result1]: [{ count: number }?] = await pg`
      SELECT COUNT(*) FROM email_confirm_email 
      WHERE user_id=${info.userId} AND issued_at>${date.utc() - 60 * 60}
    `;
    if (!result1) return undefined;
    if (result1.count >= 3) return undefined;

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
    if (!sent) return undefined;

    row.sent_at = date.utc();
    row.expires_at = date.utc() + 60 * 60; // 1 hour
    await pg`INSERT INTO email_confirm_email ${pg(row)}`;

    return {};
  }
)

const confirmEmailChange = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof confirmEmailChangeSchema>,
  async (arg, _ctx) => {
    const parsed = confirmEmailChangeSchema.safeParse(arg);
    if (!parsed.success) return undefined;

    const tkn0 = token.parse(parsed.data.token);
    if (!tkn0) return undefined;

    const [result0]: [{ id: number, userId: number, email: string, validator: Buffer, expiresAt: number }?] = await pg`
      SELECT id, user_id, email, validator, issued_at, expires_at FROM email_confirm_email
      WHERE selector=${tkn0.selector}
    `;
    if (!result0) return undefined;
    if (date.utc() >= result0.expiresAt) return undefined;
    if (!token.compare(tkn0.validator, result0.validator)) return undefined;

    const [result1]: [{ email: string }?] = await pg` SELECT email FROM users WHERE id=${result0.userId}`;
    if (!result1) return undefined;
    if (result1.email === result0.email) return undefined;

    const [result2]: [{ count: number }?] = await pg`
      SELECT COUNT(*) FROM email_confirm_email
      WHERE id>${result0.id} AND user_id=${result0.userId}
    `;
    if (!result2) return undefined;
    if (result2.count !== 0) return undefined;

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
    if (!sent) return undefined;

    row.sent_at = date.utc();
    row.expires_at = date.utc() + 60 * 60 * 24 * 30; // 30 days
    const [result3, result4, result5] = await pg.begin(pg => [
      pg`INSERT INTO email_revert_email ${pg(row)}`,
      pg`UPDATE users SET email=${result0.email} WHERE id=${result0.userId}`,
      pg`UPDATE email_confirm_email SET expires_at=${date.utc()} WHERE id=${result0.id}`
    ]);
    if (!result3.count) return undefined;
    if (!result4.count) return undefined;
    if (!result5.count) return undefined;

    return {};
  }
)

const revertEmailChange = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof revertEmailChangeSchema>,
  async (arg, _ctx) => {
    const parsed = revertEmailChangeSchema.safeParse(arg);
    if (!parsed.success) return undefined;

    const tkn0 = token.parse(parsed.data.token);
    if (!tkn0) return undefined;

    const [result0]: [{ id: number, userId: number, email: string, validator: Buffer, expiresAt: number }?] = await pg`
      SELECT id, user_id, email, validator, expires_at FROM email_revert_email
      WHERE selector=${tkn0.selector}
    `;
    if (!result0) return undefined;
    if (date.utc() >= result0.expiresAt) return undefined;
    if (!token.compare(tkn0.validator, result0.validator)) return undefined;

    const [result1]: [{ email: string }?] = await pg` SELECT email FROM users WHERE id=${result0.userId}`;
    if (!result1) return undefined;
    if (result1.email === result0.email) return undefined;

    const [result2, result3, _result4] = await pg.begin(pg => [
      pg`UPDATE users SET email=${result0.email} WHERE id=${result0.userId}`,
      pg`UPDATE email_revert_email SET expires_at=${date.utc()} WHERE id=${result0.id}`,
      pg`UPDATE email_revert_email SET expires_at=${date.utc()} 
         WHERE id>${result0.id} AND user_id=${result0.userId}`
    ]);
    if (!result2.count) return undefined;
    if (!result3.count) return undefined;

    return {};
  }
)

const initiatePasswordChange = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof initiatePasswordChangeSchema>,
  async (arg, _ctx) => {
    const parsed = initiatePasswordChangeSchema.safeParse(arg);
    if (!parsed.success) return undefined;

    (async () => {
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
    })();

    return {};
  }
)

const confirmPasswordChange = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof confirmPasswordChangeSchema>,
  async (arg, _ctx) => {
    const parsed = confirmPasswordChangeSchema.safeParse(arg);
    if (!parsed.success) return undefined;

    const tkn = token.parse(parsed.data.token);
    if (!tkn) return undefined;

    const [result0]: [{ id: number, userId: number, email: string, validator: Buffer, expiresAt: number }?] = await pg`
      SELECT id, user_id, email, validator, expires_at FROM email_change_password
      WHERE selector=${tkn.selector}
    `;
    if (!result0) return undefined;
    if (date.utc() >= result0.expiresAt) return undefined;
    if (!token.compare(tkn.validator, result0.validator)) return undefined;

    const [result1]: [{ email: string }?] = await pg` SELECT email FROM users WHERE id=${result0.userId}`;
    if (!result1) return undefined;
    if (result1.email !== result0.email) return undefined;

    const [result2]: [{ count: number }?] = await pg`
      SELECT COUNT(*) FROM email_change_password
      WHERE id>${result0.id} AND user_id=${result0.userId}
    `;
    if (!result2) return undefined;
    if (result2.count !== 0) return undefined;

    const password = await crypto.encryptPassword(parsed.data.newPassword);
    const [result3, _result4, result5] = await pg.begin(pg => [
      pg`UPDATE users SET password=${password} WHERE id=${result0.userId}`,
      pg`UPDATE sessions SET expires_at=${date.utc()} WHERE user_id=${result0.userId} AND expires_at>${date.utc()}`,
      pg`UPDATE email_change_password SET expires_at=${date.utc()} WHERE id=${result0.id}`
    ])
    if (!result3.count) return undefined;
    if (!result5.count) return undefined;

    return {};
  }
)

export default {
  getUser,

  changeUsername,

  initiateEmailChange,
  confirmEmailChange,
  revertEmailChange,

  initiatePasswordChange,
  confirmPasswordChange,
}