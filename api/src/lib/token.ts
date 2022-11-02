import { Request, Response } from "express";
import { crypto } from "./crypto";
import { date } from "./date";
import { encoding } from "./encoding";

function create(): { selector: Buffer, validator: Buffer, full: string, expires: number } {
  const selector = crypto.bytes(16);
  const validator = crypto.bytes(32);
  const full = `${encoding.fromBinary(selector, "base64url")}:${encoding.fromBinary(validator, "base64url")}`;
  const expires = date.utc() + 60 * 60 * 24 * 30;

  return { selector, validator, full, expires };
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

function attach(res: Response, token: { value: string, expires: number }) {
  res.cookie("token", token.value, {
    secure: true,
    httpOnly: true,
    sameSite: true,
    expires: new Date(token.expires * 1000),
  });
}

function detach(res: Response) {
  res.clearCookie("token");
}

function get(req: Request): string | undefined {
  return req.cookies["token"];
}

export const token = {
  create,
  parse,
  compare,

  attach,
  detach,

  get,
}