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

async function send() {
  transporter.sendMail({
    from: '"Oath" <oath@dorkodu.com>',
    to: "user@user.com",
    subject: "Test",
    text: "Test",
    html: "<b>Test?</b>",
  })
}

export const mailer = {
  send,
}