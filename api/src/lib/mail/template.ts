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
}
