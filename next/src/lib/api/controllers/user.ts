import {
  editProfileSchema,
  confirmEmailChangeSchema,
  confirmPasswordChangeSchema,
  initiateEmailChangeSchema,
  initiatePasswordChangeSchema,
  revertEmailChangeSchema,
} from "../schemas/user";
import sage from "@dorkodu/sage-server";
import { SchemaContext } from "./_schema";
import { z } from "zod";
import auth from "./auth";
import pg from "../pg";
import { IUserParsed, iUserSchema } from "@type/user";
import { token } from "../token";
import { crypto } from "../crypto";
import { mailer } from "../mail/mailer";
import { date } from "../date";
import { snowflake } from "../snowflake";
import { util } from "../util";
import { ErrorCode } from "@type/error_codes";

const getUser = sage.resource(
  {} as SchemaContext,
  undefined,
  async (_arg, ctx): Promise<{ data?: IUserParsed; error?: ErrorCode }> => {
    const info = await auth.getAuthInfo(ctx);
    if (!info) return { error: ErrorCode.Default };

    const [result] = await pg`
      SELECT id, name, username, bio, email, joined_at
      FROM users WHERE id=${info.userId}
    `;
    const parsed = iUserSchema.safeParse(result);
    if (!parsed.success) return { error: ErrorCode.Default };

    return { data: parsed.data };
  }
);

const editProfile = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof editProfileSchema>,
  async (arg, ctx): Promise<{ data?: {}, error?: ErrorCode }> => {
    const parsed = editProfileSchema.safeParse(arg);
    if (!parsed.success) return { error: ErrorCode.Default };

    const info = await auth.getAuthInfo(ctx);
    if (!info) return { error: ErrorCode.Default };

    const { name, username, bio } = parsed.data;

    // Check if username is already used by someone else
    const [result0]: [{ exists: boolean }?] = await pg`
      SELECT EXISTS (
        SELECT * FROM users
        WHERE id!=${info.userId} AND username_ci=${username.toLowerCase()}
      )
    `;
    if (!result0) return { error: ErrorCode.Default };
    if (result0.exists) return { error: ErrorCode.UsernameUsed };

    // Set name, username & bio
    const result1 = await pg`
      UPDATE users
      SET name=${name}, bio=${bio}, 
      username=${username}, username_ci=${username.toLowerCase()}
      WHERE id=${info.userId}
    `;
    if (result1.count === 0) return { error: ErrorCode.Default };

    return { data: {} };
  }
);

const initiateEmailChange = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof initiateEmailChangeSchema>,
  async (arg, ctx): Promise<{ data?: {}; error?: ErrorCode }> => {
    const parsed = initiateEmailChangeSchema.safeParse(arg);
    if (!parsed.success) return { error: ErrorCode.Default };

    const info = await auth.getAuthInfo(ctx);
    if (!info) return { error: ErrorCode.Default };

    const { newEmail } = parsed.data;

    const [result0]: [{ emailCi: string }?] = await pg`
      SELECT email_ci FROM users WHERE id=${info.userId}
    `;
    if (!result0) return { error: ErrorCode.Default };
    if (result0.emailCi === newEmail.toLowerCase()) return { error: ErrorCode.Default };

    const tkn = token.create();
    const row = {
      id: snowflake.id("email_confirm_email"),
      userId: info.userId,
      email: newEmail,
      selector: tkn.selector,
      validator: crypto.sha256(tkn.validator),
      issuedAt: date.utc(),
      sentAt: -1,
      expiresAt: -1,
    };

    (async () => {
      const sent = await mailer.sendConfirmEmailChange(newEmail, tkn.full);
      if (!sent) return;

      row.sentAt = date.utc();
      row.expiresAt = date.hour(1);
      await pg`INSERT INTO email_confirm_email ${pg(row)}`;
    })();

    return { data: {} };
  }
);

const confirmEmailChange = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof confirmEmailChangeSchema>,
  async (arg, _ctx): Promise<{ data?: {}; error?: ErrorCode }> => {
    const parsed = confirmEmailChangeSchema.safeParse(arg);
    if (!parsed.success) return { error: ErrorCode.Default };

    const tkn0 = token.parse(parsed.data.token);
    if (!tkn0) return { error: ErrorCode.Default };

    const [result0]: [
      {
        id: string;
        userId: string;
        email: string;
        validator: Buffer;
        sentAt: string;
        expiresAt: string;
      }?
    ] = await pg`
      SELECT id, user_id, email, validator, sent_at, expires_at FROM email_confirm_email
      WHERE selector=${tkn0.selector}
    `;
    if (!result0) return { error: ErrorCode.Default };
    if (!token.check(result0, tkn0.validator))
      return { error: ErrorCode.Default };
    if (util.intParse(result0.sentAt, -1) === -1)
      return { error: ErrorCode.Default };

    const [result1]: [{ email: string }?] =
      await pg`SELECT email FROM users WHERE id=${result0.userId}`;
    if (!result1) return { error: ErrorCode.Default };
    if (result1.email.toLocaleLowerCase() === result0.email.toLocaleLowerCase()) return { error: ErrorCode.Default };

    const [result2]: [{ exists: boolean }?] = await pg`
      SELECT EXISTS (
        SELECT * FROM email_confirm_email
        WHERE id>${result0.id} AND user_id=${result0.userId}
      )
    `;
    if (!result2) return { error: ErrorCode.Default };
    if (result2.exists) return { error: ErrorCode.Default };

    const oldEmail = result1.email;
    const tkn1 = token.create();
    const row = {
      id: snowflake.id("email_revert_email"),
      userId: result0.userId,
      email: oldEmail,
      selector: tkn1.selector,
      validator: crypto.sha256(tkn1.validator),
      issuedAt: date.utc(),
      sentAt: -1,
      expiresAt: -1,
    };

    (async () => {
      const sent = await mailer.sendRevertEmailChange(oldEmail, tkn1.full);
      if (!sent) return;

      row.sentAt = date.utc();
      row.expiresAt = date.day(30);
      await pg.begin(pg => [
        pg`INSERT INTO email_revert_email ${pg(row)}`,
        pg`
          UPDATE users
          SET email=${result0.email}, email_ci=${result0.email.toLowerCase()}
          WHERE id=${result0.userId}
        `,
        pg`UPDATE email_confirm_email SET expires_at=${date.utc()} WHERE id=${result0.id}`
      ]);
    })();

    return { data: {} };
  }
);

const revertEmailChange = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof revertEmailChangeSchema>,
  async (arg, _ctx): Promise<{ data?: {}; error?: ErrorCode }> => {
    const parsed = revertEmailChangeSchema.safeParse(arg);
    if (!parsed.success) return { error: ErrorCode.Default };

    const tkn0 = token.parse(parsed.data.token);
    if (!tkn0) return { error: ErrorCode.Default };

    const [result0]: [
      {
        id: string;
        userId: string;
        email: string;
        validator: Buffer;
        sentAt: string;
        expiresAt: string;
      }?
    ] = await pg`
      SELECT id, user_id, email, validator, sent_at, expires_at FROM email_revert_email
      WHERE selector=${tkn0.selector}
    `;
    if (!result0) return { error: ErrorCode.Default };
    if (!token.check(result0, tkn0.validator))
      return { error: ErrorCode.Default };
    if (util.intParse(result0.sentAt, -1) === -1)
      return { error: ErrorCode.Default };

    const [result1]: [{ email: string }?] =
      await pg` SELECT email FROM users WHERE id=${result0.userId}`;
    if (!result1) return { error: ErrorCode.Default };
    if (result1.email.toLocaleLowerCase() === result0.email.toLocaleLowerCase()) return { error: ErrorCode.Default };

    const [result2, result3, _result4] = await pg.begin(pg => [
      pg`UPDATE users
        SET email=${result0.email}, email_ci=${result0.email.toLowerCase()}
        WHERE id=${result0.userId}
      `,
      pg`UPDATE email_revert_email SET expires_at=${date.utc()} WHERE id=${result0.id}`,
      pg`UPDATE email_revert_email SET expires_at=${date.utc()} 
         WHERE id>${result0.id} AND user_id=${result0.userId}
      `,
    ]);
    if (!result2.count) return { error: ErrorCode.Default };
    if (!result3.count) return { error: ErrorCode.Default };

    return { data: {} };
  }
);

const initiatePasswordChange = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof initiatePasswordChangeSchema>,
  async (arg, _ctx): Promise<{ data?: {}; error?: ErrorCode }> => {
    const parsed = initiatePasswordChangeSchema.safeParse(arg);
    if (!parsed.success) return { error: ErrorCode.Default };

    (async () => {
      const { username, email } = parsed.data;

      const [result0]: [{ id: string }?] = await pg`
        SELECT id FROM users
        WHERE username_ci=${username.toLowerCase()} AND email_ci=${email.toLowerCase()}
      `;
      if (!result0) return;

      const tkn = token.create();
      const row = {
        id: snowflake.id("email_change_password"),
        userId: result0.id,
        selector: tkn.selector,
        validator: crypto.sha256(tkn.validator),
        issuedAt: date.utc(),
        sentAt: -1,
        expiresAt: -1,
      }

      const sent = await mailer.sendConfirmPasswordChange(email, tkn.full);
      if (!sent) return;

      row.sentAt = date.utc();
      row.expiresAt = date.hour(1);
      await pg`INSERT INTO email_change_password ${pg(row)}`;
    })();

    return { data: {} };
  }
);

const confirmPasswordChange = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof confirmPasswordChangeSchema>,
  async (arg, _ctx): Promise<{ data?: {}; error?: ErrorCode }> => {
    const parsed = confirmPasswordChangeSchema.safeParse(arg);
    if (!parsed.success) return { error: ErrorCode.Default };

    const tkn = token.parse(parsed.data.token);
    if (!tkn) return { error: ErrorCode.Default };

    const [result0]: [{ id: string, userId: string, validator: Buffer, sentAt: string, expiresAt: string }?] = await pg`
      SELECT id, user_id, validator, sent_at, expires_at FROM email_change_password
      WHERE selector=${tkn.selector}
    `;
    if (!result0) return { error: ErrorCode.Default };
    if (!token.check(result0, tkn.validator))
      return { error: ErrorCode.Default };
    if (util.intParse(result0.sentAt, -1) === -1)
      return { error: ErrorCode.Default };

    const [result2]: [{ exists: boolean }?] = await pg`
      SELECT EXISTS (
        SELECT * FROM email_change_password
        WHERE id>${result0.id} AND user_id=${result0.userId}
      )
    `;
    if (!result2) return { error: ErrorCode.Default };
    if (result2.exists) return { error: ErrorCode.Default };

    const password = await crypto.encryptPassword(parsed.data.newPassword);
    const [result3, _result4, result5] = await pg.begin((pg) => [
      pg`UPDATE users SET password=${password} WHERE id=${result0.userId}`,
      pg`UPDATE sessions SET expires_at=${date.utc()} WHERE user_id=${result0.userId} AND expires_at>${date.utc()}`,
      pg`UPDATE access_tokens SET expires_at=${date.utc()} WHERE user_id=${result0.userId} AND expires_at>${date.utc()}`,
      pg`UPDATE access_codes SET expires_at=${date.utc()} WHERE user_id=${result0.userId} AND expires_at>${date.utc()}`,
      pg`UPDATE email_change_password SET expires_at=${date.utc()} WHERE id=${result0.id}`
    ]);
    if (result3.count === 0) return { error: ErrorCode.Default };
    if (result5.count === 0) return { error: ErrorCode.Default };

    return { data: {} };
  }
);

export default {
  getUser,

  editProfile,

  initiateEmailChange,
  confirmEmailChange,
  revertEmailChange,

  initiatePasswordChange,
  confirmPasswordChange,
};
