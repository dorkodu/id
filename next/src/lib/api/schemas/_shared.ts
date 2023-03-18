import { z } from "zod";

const name = z.string().trim().min(1).max(64);
const username = z.string().trim().regex(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9_.]{1,16}(?<![_.])$/);
const email = z.string().trim().email().max(320);
const password = z.string().min(8);
const bio = z.string().trim().max(500);

const token = z.string();
const code = z.string();

const anchor = z.string();
const type = z.enum(["newer", "older"]);

const service = z.string().max(128);

export const sharedSchemas = {
  name,
  username,
  email,
  password,
  bio,

  token,
  code,

  anchor,
  type,

  service,
}