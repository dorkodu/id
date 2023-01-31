import nodemailer from "nodemailer";
import { config } from "../../config";

import { VerifyLogin } from "./templates";

const url = "https://id.dorkodu.com";

const transporter = nodemailer.createTransport({
  pool: true,
  host: config.smtpHost,
  port: config.smtpPort,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPassword,
  },
});

function sendVerifyLogin(
  email: string,
  token: string,
  ip: string,
  userAgent: string
): Promise<boolean> {
  const link = `${url}/login?token=${token}`;

  return new Promise((resolve) => {
    transporter.sendMail(
      VerifyLogin({ address: email, ip, userAgent, link }),
      async (err, info) => {
        const sent =
          !err && (!info.rejected.length || info.rejected[0] !== email);
        resolve(sent);
      }
    );
  });
}

function sendVerifySignup(email: string, token: string): Promise<boolean> {
  const link = `${url}/create-account?token=${token}`;

  return new Promise((resolve) => {
    transporter.sendMail(
      {
        from: '"ID" <id@dorkodu.com>',
        to: email,
        subject: "Verify Create Account",
        text: `${link}`,
        html: `<a href="${link}">${link}</a>`,
      },
      async (err, info) => {
        const sent =
          !err && (!info.rejected.length || info.rejected[0] !== email);
        resolve(sent);
      }
    );
  });
}

function sendConfirmEmailChange(
  email: string,
  token: string
): Promise<boolean> {
  const link = `${url}/confirm-email-change?token=${token}`;

  return new Promise((resolve) => {
    transporter.sendMail(
      {
        from: '"ID" <id@dorkodu.com>',
        to: email,
        subject: "Confirm Email Change",
        text: `${link}`,
        html: `<a href="${link}">${link}</a>`,
      },
      async (err, info) => {
        const sent =
          !err && (!info.rejected.length || info.rejected[0] !== email);
        resolve(sent);
      }
    );
  });
}

function sendRevertEmailChange(email: string, token: string): Promise<boolean> {
  const link = `${url}/revert-email-change?token=${token}`;

  return new Promise((resolve) => {
    transporter.sendMail(
      {
        from: '"ID" <id@dorkodu.com>',
        to: email,
        subject: "Revert Email Change",
        text: `${link}`,
        html: `<a href="${link}">${link}</a>`,
      },
      async (err, info) => {
        const sent =
          !err && (!info.rejected.length || info.rejected[0] !== email);
        resolve(sent);
      }
    );
  });
}

function sendConfirmPasswordChange(
  email: string,
  token: string
): Promise<boolean> {
  const link = `${url}/confirm-password-change?token=${token}`;

  return new Promise((resolve) => {
    transporter.sendMail(
      {
        from: '"ID" <id@dorkodu.com>',
        to: email,
        subject: "Confirm Password Change",
        text: `${link}`,
        html: `<a href="${link}">${link}</a>`,
      },
      async (err, info) => {
        const sent =
          !err && (!info.rejected.length || info.rejected[0] !== email);
        resolve(sent);
      }
    );
  });
}

export const mailer = {
  sendVerifyLogin,
  sendVerifySignup,

  sendConfirmEmailChange,
  sendRevertEmailChange,

  sendConfirmPasswordChange,
};
