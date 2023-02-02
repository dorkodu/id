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
    }
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

  export const VerifySignup: EmailBlueprint<{
    address: string;
    link: string;
  }> = ({ address, link }) =>
      StandardEmailMessage({
        to: address,
        subject: "Verify Your Email @ Dorkodu",
        summary:
          "You need to verify your email to complete creating a Dorkodu account.",
        text: `
      Hello.
      Welcome to Dorkodu! 
  
      We need to verify that this email is active and belongs to you.
  
      If you didn't try to create a Dorkodu account recently, ignore this email.
      
      Verification Link:
      ${link}
      `,
        html: `
      ${Block.Subtitle("Welcome to Dorkodu!")}
      ${Block.Text("Hello, there.")}
      ${Block.Text(
          `We need to verify this email is active and belongs to you.`
        )}
      ${Block.Text(
          `If you didn't try to create a Dorkodu account recently, <b>ignore this email</b>.`
        )}
      ${Block.CallToAction("Verify Email", link)}
      `,
      });

  export const ConfirmEmailChange: EmailBlueprint<{
    address: string;
    link: string;
  }> = ({ address, link }) =>
      StandardEmailMessage({
        to: address,
        subject: "Confirm Email Change @ Dorkodu",
        summary:
          "You need to verify your email to complete creating a Dorkodu account.",
        text: `
      We need you to confirm a recent email change request.
  
      If you didn't intend so, ignore this email.
      
      Confirm Email Change:
      ${link}
      `,
        html: `
      ${Block.Text(`We need you to confirm a recent email change request.`)}
      ${Block.Text(`If you didn't intend so, ignore this email.`)}
      ${Block.CallToAction("Confirm Email Change", link)}
      `,
      });

  export const RevertEmailChange: EmailBlueprint<{
    address: string;
    link: string;
  }> = ({ address, link }) =>
      StandardEmailMessage({
        to: address,
        subject: "Revert Email Change @ Dorkodu",
        summary: "You may want to revert the recent email change.",
        text: `
        Recently the email address at your Dorkodu account has been changed.
        Now your account is connected to a different email address, not this one.

        If you didn't intend so, you may want to revert the email change.
        
        
        Revert Email Change:
        ${link}
        `,
        html: `
        ${Block.Text(
          `Recently the email address at your <b>Dorkodu</b> account has been <b>changed</b>. <br>Now your account is connected to a <b>different email address, not this one</b>.`
        )}
        ${Block.Text(
          `If you didn't intend to do so, you <b>may</b> want to <b>revert the email change</b>.`
        )}
        ${Block.CallToAction("Revert Email Change", link)}
        `,
      });

  export const ConfirmPasswordChange: EmailBlueprint<{
    address: string;
    link: string;
  }> = ({ address, link }) =>
      StandardEmailMessage({
        to: address,
        subject: "Confirm Password Change @ Dorkodu",
        summary: "You need to confirm your password change.",
        text: `
          We need you to confirm the recent password change request for your Dorkodu account.
      
          If you didn't intend so, ignore this email.
          
          Confirm Password Change:
          ${link}
          `,
        html: `
          ${Block.Text(
          `We need you to confirm the recent password change request.`
        )}
          ${Block.Text(`If you didn't intend so, ignore this email.`)}
          ${Block.CallToAction("Confirm Password Change", link)}
          `,
      });
}
