// email templates

import Mail from "nodemailer/lib/mailer";
import { Block } from "./mailscript";

//? Started Jan 31, 2023 - Doruk Was Here

type EmailBlueprint<T extends { address: string }> = (data: T) => Mail.Options;

export namespace EmailTemplate {
}
