import { NextFunction, Request, Response } from "express";

import pg from "../pg";
import { authSchema, loginSchema, logoutSchema, signupSchema } from "../schemas/auth";

async function middleware(req: Request, res: Response, next: NextFunction) {
  next();
}

async function auth(req: Request, res: Response) {
  const parsed = authSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const result = await pg``;
}

async function signup(req: Request, res: Response) {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return void res.status(500).send();

  const result = await pg``;
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

export default { middleware, auth, signup, login, logout }