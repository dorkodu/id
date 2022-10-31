import { Request, Response } from "express";
import { crypto } from "./crypto";
import { date } from "./date";

function create(): { selector: Buffer, validator: Buffer, expires: number } {
  const selector = crypto.bytes(16);
  const validator = crypto.bytes(32);
  const expires = date.utc() + 60 * 60 * 24 * 30;

  return { selector, validator, expires };
}

function parse(token: string): undefined | { selector: string, validator: string } {
  const split = token.split(":");
  const selector = split[0];
  const validator = split[1];

  if (!selector || !validator) return undefined;
  return { selector, validator };
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
  attach,
  detach,
  get,
}