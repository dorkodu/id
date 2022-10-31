import { Request, Response } from "express";
import bcrypt from "bcrypt";

import pg from "../pg";
import { authSchema, loginSchema, logoutSchema, signupSchema } from "../schemas/auth";
import { fromBinary, sha256, utcTimestamp } from "../utils";
import { config } from "../config";

async function auth(req: Request, res: Response) {
  const parsed = authSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const result = await pg``;
}

async function signup(req: Request, res: Response) {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const user = {
    username: parsed.data.username,
    email: parsed.data.email,
    password: await encryptPassword(parsed.data.password),
    date: utcTimestamp(),
  }

  const result = await pg`INSERT INTO user ${pg(user)}`;
}

async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();
  if (!parsed.data.username && !parsed.data.email) return void res.status(500).send();
  if (parsed.data.username && parsed.data.email) return void res.status(500).send();

  const result = await pg``;
}

async function logout(req: Request, res: Response) {
  const parsed = logoutSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const result = await pg``;
}

async function comparePassword(raw: string, encrypted: Buffer) {
  return await bcrypt.compare(sha256(raw).toString("base64"), fromBinary(encrypted, "utf8"));
}

async function encryptPassword(raw: string) {
  return await bcrypt.hash(sha256(raw).toString("base64"), config.bcryptRounds);
}

export default { auth, signup, login, logout }