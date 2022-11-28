import { Request, Response } from "express";
import { config } from "../config";
import { crypto } from "./crypto";
import { date } from "./date";
import { encoding } from "./encoding";

function create() {
  const selector = crypto.bytes(16);
  const validator = crypto.bytes(32);
  const full = `${encoding.fromBinary(selector, "base64url")}:${encoding.fromBinary(validator, "base64url")}`;
  const createdAt = date.utc();
  const expiresAt = date.utc() + 60 * 60 * 24 * 30; // 30 days

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

function attach(res: Response, token: { value: string, expiresAt: number }) {
  res.cookie("token", token.value, {
    secure: config.env === "production",
    httpOnly: true,
    sameSite: true,
    expires: new Date(token.expiresAt * 1000),
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