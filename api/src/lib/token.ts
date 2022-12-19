import { Request, Response } from "express";
import { crypto } from "./crypto";
import { encoding } from "./encoding";

const cookies = {
  session: "session"
}

function create() {
  const selector = crypto.bytes(32);
  const validator = crypto.bytes(32);
  const full = `${encoding.fromBinary(selector, "base64url")}:${encoding.fromBinary(validator, "base64url")}`;

  return { selector, validator, full };
}

function parse(token: string): undefined | { selector: Buffer, validator: Buffer } {
  const split = token.split(":");
  if (!split[0] || !split[1]) return undefined;

  const selector = encoding.toBinary(split[0], "base64url");
  const validator = encoding.toBinary(split[1], "base64url");

  return { selector, validator };
}

function compare(raw: Buffer, encrypted: Buffer) {
  return encoding.compareBinary(crypto.sha256(raw), encrypted);
}

function attach(res: Response, token: { value: string, expiresAt: number }, cookie: keyof typeof cookies) {
  res.cookie(cookies[cookie], token.value, {
    secure: true,
    httpOnly: true,
    sameSite: true,
    expires: new Date(token.expiresAt),
  });
}

function detach(res: Response, cookie: keyof typeof cookies) {
  res.clearCookie(cookies[cookie]);
}

function get(req: Request, cookie: keyof typeof cookies): string | undefined {
  return req.cookies[cookies[cookie]];
}

export const token = {
  create,
  parse,
  compare,

  attach,
  detach,

  get,
}