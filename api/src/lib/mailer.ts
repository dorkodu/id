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

async function sendSecurityNotification(email: string) {
  transporter.sendMail({
    from: '"Oath" <oath@dorkodu.com>',
    to: email,
    subject: "",
    html: ``,
  })
}

async function sendSecurityVerification(email: string) {
  transporter.sendMail({
    from: '"Oath" <oath@dorkodu.com>',
    to: email,
    subject: "",
    html: ``,
  })
}

export const mailer = {
  sendSecurityNotification,
  sendSecurityVerification,
}