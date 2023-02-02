// email templates

import Mail from "nodemailer/lib/mailer";
import { Block } from "./mailscript";

//? Started Jan 31, 2023 - Doruk Was Here

type EmailBlueprint<T extends { address: string }> = (data: T) => Mail.Options;

export namespace EmailTemplate {
  const StandardEmailMessage = ({
    to,
    subject,
    summary,
    text,
    html,
  }: {
    to: string;
    subject: string;
    summary?: string;
    text: string;
    html: string;
  }) => {
    return {
      from: '"Dorkodu ID" <hey@dorkodu.com>',
      to,
      subject: subject,
      text: `
  ${subject}
  
  ${summary ?? ""}
  
  ${text}
  
  © 2023 Dorkodu 
  <https://dorkodu.com>
  `,
      html: Block.Document(
        subject,
        summary ?? "",
        `${Block.Card(`
          ${Block.Logo(
            "https://id.dorkodu.com/images/dorkodu-id.svg",
            "Dorkodu ID"
          )}
          ${Block.Title(subject)}
          ${html}
        `)} 
        ${Block.Footer()}`
      ),
    } satisfies Mail.Options;
  };

  export const VerifyLogin: EmailBlueprint<{
    address: string;
    ip: string;
    userAgent: string;
    link: string;
  }> = ({ address, ip, userAgent, link }) =>
    StandardEmailMessage({
      to: address,
      subject: "Verify Login @ Dorkodu",
      summary: "We need to verify if recent login was you.",
      text: `
      Hello,

      We need to verify that it was you. If you didn't login with Dorkodu from a new device recently, you should ignore this email.
      
      Verification Link: 
      ${link}
      
      Login Details
      ---------
      IP: ${ip}
      Device: ${userAgent}
  
      If you are sure it wasn't you, someone might logged in with your account.
  
      We suggest you to check security and change your password.
      `,
      html: `
  
      ${Block.Text("Hello, ")}
      ${Block.Text(
        `We need to verify that it was you. If you didn't login with <b>Dorkodu</b> from a new device recently, you should <b>ignore</b> this email.`
      )}
      ${Block.CallToAction("Verify Login", link)}
      ${Block.Divider()}
      ${Block.Subtitle("Details")}
      ${Block.ValuePairs([
        ["IP", ip],
        ["Device", userAgent],
      ])}
      ${Block.Text(
        "If you are sure it wasn't you, someone might logged in with your account. <br>We suggest you to check security and change your password."
      )}
      `,
    });

}
