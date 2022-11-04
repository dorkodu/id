import nodemailer from "nodemailer";
import { config } from "../config";

const transporter = nodemailer.createTransport({
  pool: true,
  host: config.smtpHost,
  port: config.smtpPort,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPassword,
  }
})

async function sendSecurityNewLocation(email: string) {
  transporter.sendMail({
    from: '"Oath" <oath@dorkodu.com>',
    to: email,
    subject: "New Location",
    html: ``,
  })
}

async function sendSecurityEmailChange(email: string) {
  transporter.sendMail({
    from: '"Oath" <oath@dorkodu.com>',
    to: email,
    subject: "Email Change",
    html: ``,
  })
}

async function sendSecurityPasswordChange(email: string) {
  transporter.sendMail({
    from: '"Oath" <oath@dorkodu.com>',
    to: email,
    subject: "Password Change",
    html: ``,
  })
}

export const mailer = {
  sendSecurityNewLocation,
  sendSecurityEmailChange,
  sendSecurityPasswordChange,
}