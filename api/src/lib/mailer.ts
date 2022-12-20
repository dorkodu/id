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
      html: `<div>${ip}</div><div>${userAgent}</div><a href="${link}">${link}</a>`,
    }, async (err, info) => {
      const sent = !err && (!info.rejected.length || info.rejected[0] !== email);
      resolve(sent);
    })
  })
}

function sendVerifySignup(email: string, token: string) {
  const link = `${url}/signup?token=${token}`;

  return new Promise((resolve) => {
    transporter.sendMail({
      from: '"ID" <id@dorkodu.com>',
      to: email,
      subject: "Verify Signup",
      text: `${link}`,
      html: `<a href="${link}">${link}</a>`,
    }, async (err, info) => {
      const sent = !err && (!info.rejected.length || info.rejected[0] !== email);
      resolve(sent);
    })
  })
}

function sendConfirmEmailChange(email: string, token: string): Promise<boolean> {
  const link = `${url}/confirm_email_change?token=${token}`;

  return new Promise((resolve) => {
    transporter.sendMail({
      from: '"ID" <id@dorkodu.com>',
      to: email,
      subject: "Confirm Email Change",
      text: `${link}`,
      html: `<a href="${link}">${link}</a>`,
    }, async (err, info) => {
      const sent = !err && (!info.rejected.length || info.rejected[0] !== email);
      resolve(sent);
    })
  })
}

function sendRevertEmailChange(email: string, token: string): Promise<boolean> {
  const link = `${url}/revert_email_change?token=${token}`;

  return new Promise((resolve) => {
    transporter.sendMail({
      from: '"ID" <id@dorkodu.com>',
      to: email,
      subject: "Revert Email Change",
      text: `${link}`,
      html: `<a href="${link}">${link}</a>`,
    }, async (err, info) => {
      const sent = !err && (!info.rejected.length || info.rejected[0] !== email);
      resolve(sent);
    })
  })
}

function sendConfirmPasswordChange(email: string, token: string): Promise<boolean> {
  const link = `${url}/confirm_password_change?token=${token}`;

  return new Promise((resolve) => {
    transporter.sendMail({
      from: '"ID" <id@dorkodu.com>',
      to: email,
      subject: "Confirm Password Change",
      text: `${link}`,
      html: `<a href="${link}">${link}</a>`,
    }, async (err, info) => {
      const sent = !err && (!info.rejected.length || info.rejected[0] !== email);
      resolve(sent);
    })
  })
}

export const mailer = {
  sendVerifyLogin,
  sendVerifySignup,

  sendConfirmEmailChange,
  sendRevertEmailChange,

  sendConfirmPasswordChange,
}