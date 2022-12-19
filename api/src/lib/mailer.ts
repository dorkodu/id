import nodemailer from "nodemailer";
import { config } from "../config";

const url = "https://id.dorkodu.com";

const transporter = nodemailer.createTransport({
  pool: true,
  host: config.smtpHost,
  port: config.smtpPort,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPassword,
  },
})

function sendVerifyLogin(email: string, token: string, ip: string, userAgent: string): Promise<boolean> {
  const link = `${url}/login?token=${token}`;

  return new Promise((resolve) => {
    transporter.sendMail({
      from: '"ID" <id@dorkodu.com>',
      to: email,
      subject: "Verify Login",
      text: `${ip} ${userAgent} ${link}`,
      html: `<div>${ip}</div><div>${userAgent}</div><div>${link}</div>`,
    }, async (err, info) => {
      const sent = !err && (!info.rejected.length || info.rejected[0] !== email);
      resolve(sent);
    })
  })
}

function sendVerifySignup(email: string, token: string, ip: string, userAgent: string) {
  const link = `${url}/signup?token=${token}`;

  return new Promise((resolve) => {
    transporter.sendMail({
      from: '"ID" <id@dorkodu.com>',
      to: email,
      subject: "Verify Signup",
      text: `${ip} ${userAgent} ${link}`,
      html: `<div>${ip}</div><div>${userAgent}</div><div>${link}</div>`,
    }, async (err, info) => {
      const sent = !err && (!info.rejected.length || info.rejected[0] !== email);
      resolve(sent);
    })
  })
}

function sendConfirmEmailChange(_email: string, _token: string): Promise<boolean> {
  return Promise.resolve(true);
}

function sendRevertEmailChange(_email: string, _token: string): Promise<boolean> {
  return Promise.resolve(true);
}

function sendConfirmPasswordChange(_email: string, _token: string): Promise<boolean> {
  return Promise.resolve(true);
}

export const mailer = {
  sendVerifyLogin,
  sendVerifySignup,

  sendConfirmEmailChange,
  sendRevertEmailChange,

  sendConfirmPasswordChange,
}