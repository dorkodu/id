import nodemailer from "nodemailer";
import { config } from "../config";
import pg from "../pg";
import { date } from "./date";

const transporter = nodemailer.createTransport({
  pool: true,
  host: config.smtpHost,
  port: config.smtpPort,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPassword,
  },
})

function sendConfirmEmailChange(email: string, ids: [number, number], token: string): Promise<boolean> {
  return new Promise((resolve) => {
    transporter.sendMail({
      from: '"Oath" <oath@dorkodu.com>',
      to: email,
      subject: "Confirm Email Change",
      html: `${token}`,
    }, async (err, info) => {
      const sent = !err && (!info.rejected.length || info.rejected[0] !== email);

      if (sent) {
        const sentAt = date.utc();
        const expiresAt = sentAt + 60 * 60 * 24 * 30;
        await pg`UPDATE security_verification SET sent_at=${sentAt}, expires_at=${expiresAt} WHERE id=${ids[0]}`
      }
      else {
        await pg`DELETE FROM security_verification WHERE id IN ${pg(ids)}`
      }

      resolve(sent);
    })
  })
}

function sendRevertEmailChange(email: string, ids: [number, number], token: string): Promise<boolean> {
  return new Promise((resolve) => {
    transporter.sendMail({
      from: '"Oath" <oath@dorkodu.com>',
      to: email,
      subject: "Revert Email Change",
      html: `${token}`,
    }, async (err, info) => {
      const sent = !err && (!info.rejected.length || info.rejected[0] !== email);

      if (sent) {
        const sentAt = date.utc();
        const expiresAt = sentAt + 60 * 60 * 24 * 30;
        await pg`UPDATE security_verification SET sent_at=${sentAt}, expires_at=${expiresAt} WHERE id=${ids[1]}`
      }
      else {
        await pg`DELETE FROM security_verification WHERE id IN ${pg(ids)}`
      }

      resolve(sent);
    })
  })
}

function sendConfirmPasswordChange(email: string, token: string) {
  transporter.sendMail({
    from: '"Oath" <oath@dorkodu.com>',
    to: email,
    subject: "",
    html: `${token}`,
  })
}

export const mailer = {
  sendConfirmEmailChange,
  sendRevertEmailChange,
  sendConfirmPasswordChange,
}