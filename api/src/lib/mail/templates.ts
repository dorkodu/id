// email templates

import Mail from "nodemailer/lib/mailer";

//? Jan 31, 2023 - Doruk Eray
type EmailMessage<T extends { address: string }> = (data: T) => Mail.Options;

let BaseEmailTemplate: Mail.Options = {
  from: '"Dorkodu ID" <id@dorkodu.com>',
  to: "",
  subject: "",
  text: "",
  html: "",
};

const EmailHtmlContent: string = ``;

export const VerifyLogin: EmailMessage<{
  address: string;
  ip: string;
  userAgent: string;
  link: string;
}> = ({ address, ip, userAgent, link }) => {
  return {
    from: '"Dorkodu ID" <id@dorkodu.com>',
    to: address,
    subject: "Verify Login",
    text: `${ip} ${userAgent} ${link}`,
    html: `<div>${ip}</div><div>${userAgent}</div><a href="${link}">${link}</a>`,
  };
};
