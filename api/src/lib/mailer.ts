import nodemailer from "nodemailer";
import { config } from "../config";
import { emailTypes } from "../types/types";

const transporter = nodemailer.createTransport({
  pool: true,
  host: config.smtpHost,
  port: config.smtpPort,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPassword,
  },
})

function sendConfirmEmailChange(email: string, token: string): Promise<boolean> {
  const link = `http://localhost:8000/?type=${emailTypes.confirmEmailChange}&token=${token}`;

  return new Promise((resolve) => {
    transporter.sendMail({
      from: '"Oath" <oath@dorkodu.com>',
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
  const link = `http://localhost:8000/?type=${emailTypes.revertEmailChange}&token=${token}`;

  return new Promise((resolve) => {
    transporter.sendMail({
      from: '"Oath" <oath@dorkodu.com>',
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