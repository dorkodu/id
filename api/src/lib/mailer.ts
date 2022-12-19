import nodemailer from "nodemailer";
import { webRoutes } from "../../../shared/src/web_routes";
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

function sendConfirmEmailChange(email: string, token: string): Promise<boolean> {
  //const link = `http://localhost:8000/${webRoutes.confirmEmailChange}?token=${token}`;
  //
  //return new Promise((resolve) => {
  //  transporter.sendMail({
  //    from: '"ID" <id@dorkodu.com>',
  //    to: email,
  //    subject: "Confirm Email Change",
  //    text: `${link}`,
  //    html: `<a href="${link}">${link}</a>`,
  //  }, async (err, info) => {
  //    const sent = !err && (!info.rejected.length || info.rejected[0] !== email);
  //    resolve(sent);
  //  })
  //})
  return Promise.resolve(true);
}

function sendRevertEmailChange(email: string, token: string): Promise<boolean> {
  //const link = `http://localhost:8000/${webRoutes.revertEmailChange}?token=${token}`;
  //
  //return new Promise((resolve) => {
  //  transporter.sendMail({
  //    from: '"ID" <id@dorkodu.com>',
  //    to: email,
  //    subject: "Revert Email Change",
  //    text: `${link}`,
  //    html: `<a href="${link}">${link}</a>`,
  //  }, async (err, info) => {
  //    const sent = !err && (!info.rejected.length || info.rejected[0] !== email);
  //    resolve(sent);
  //  })
  //})
  return Promise.resolve(true);
}

function sendConfirmPasswordChange(email: string, token: string): Promise<boolean> {
  //const link = `http://localhost:8000/${webRoutes.confirmPasswordChange}?token=${token}`;
  //
  //return new Promise((resolve) => {
  //  transporter.sendMail({
  //    from: '"ID" <id@dorkodu.com>',
  //    to: email,
  //    subject: "Confirm Password Change",
  //    text: `${link}`,
  //    html: `<a href="${link}">${link}</a>`,
  //  }, async (err, info) => {
  //    const sent = !err && (!info.rejected.length || info.rejected[0] !== email);
  //    resolve(sent);
  //  })
  //})
  return Promise.resolve(true);
}

export const mailer = {
  sendVerifyLogin,
  sendVerifySignup,

  sendConfirmEmailChange,
  sendRevertEmailChange,

  sendConfirmPasswordChange,
}