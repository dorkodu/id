import { Request, Response } from "express";
import { crypto } from "./crypto";
import { encoding } from "./encoding";

function create(createdAt: number, expiresAt: number) {
  const selector = crypto.bytes(32);
  const validator = crypto.bytes(32);
  const full = `${encoding.fromBinary(selector, "base64url")}:${encoding.fromBinary(validator, "base64url")}`;

  return { selector, validator, full, createdAt, expiresAt };
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

function attach(res: Response, token: { value: string, expiresAt: number }, cookie: string) {
  res.cookie(cookie, token.value, {
    secure: true,
    httpOnly: true,
    sameSite: true,
    expires: new Date(token.expiresAt),
  });
}

function detach(res: Response, cookie: string) {
  res.clearCookie(cookie);
}

function get(req: Request, cookie: string): string | undefined {
  return req.cookies[cookie];
}

export const token = {
  create,
  parse,
  compare,

  attach,
  detach,

  get,
}