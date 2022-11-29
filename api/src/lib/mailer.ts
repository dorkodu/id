import nodemailer from "nodemailer";
import { EmailTypes } from "../../../shared/src/email_types";
import { config } from "../config";

const transporter = nodemailer.createTransport({
  pool: true,
  host: config.smtpHost,
  port: config.smtpPort,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPassword,
  },
})

function sendNewLocation(email: string, ip: string, userAgent: string): Promise<boolean> {
  return new Promise((resolve) => {
    transporter.sendMail({
      from: '"ID" <id@dorkodu.com>',
      to: email,
      subject: "New Location",
      text: `${ip} ${userAgent}`,
      html: `<div>${ip}</div><div>${userAgent}</div>`,
    }, async (err, info) => {
      const sent = !err && (!info.rejected.length || info.rejected[0] !== email);
      resolve(sent);
    })
  })
}

function sendConfirmEmail(email: string, otp: number) {
  return new Promise((resolve) => {
    transporter.sendMail({
      from: '"ID" <id@dorkodu.com>',
      to: email,
      subject: "Confirm Email",
      text: `${otp}`,
      html: `your code: ${otp}`,
    }, async (err, info) => {
      const sent = !err && (!info.rejected.length || info.rejected[0] !== email);
      resolve(sent);
    })
  })
}

function sendConfirmEmailChange(email: string, token: string): Promise<boolean> {
  const link = `http://localhost:8000/${EmailTypes.ConfirmEmailChange}?token=${token}`;

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
  const link = `http://localhost:8000/${EmailTypes.RevertEmailChange}?token=${token}`;

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

function sendConfirmPasswordChange(email: string, token: string) {
  const link = `http://localhost:8000/${EmailTypes.ConfirmPasswordChange}?token=${token}`;

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
  sendNewLocation,
  sendConfirmEmail,
  sendConfirmEmailChange,
  sendRevertEmailChange,
  sendConfirmPasswordChange,
}