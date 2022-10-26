import { Request, Response } from "express";

import { authSchema, loginSchema, logoutSchema, signupSchema } from "../schemas/auth";
import * as bcrypt from "bcrypt";
import { fromBinary, sha256 } from "../utils";
import { config } from "../config";

async function auth(req: Request, res: Response) {
  const parsed = authSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  return;
}

async function signup(req: Request, res: Response) {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  return;
}

async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  return;
}

async function logout(req: Request, res: Response) {
  const parsed = logoutSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  return;
}

function parseToken(token: string): { selector: string, validator: string } | undefined {
  const split = token.split(":");
  if (split.length !== 2) return undefined;
  return { selector: split[0] as string, validator: split[1] as string };
}

async function encryptPassword(password: string) {
  return await bcrypt.hash(sha256(password).toString("base64"), config.bcryptRounds);
}

async function comparePassword(plainPassword: string, encryptedPassword: Buffer) {
  return await bcrypt.compare(sha256(plainPassword).toString("base64"), fromBinary(encryptedPassword, "utf8"))
}

export default { auth, signup, login, logout }