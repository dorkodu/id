import { z } from "zod";

const username = z.string().regex(/^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,14}(?:[A-Za-z0-9_]))?)$/);
const email = z.string().max(320);
const password = z.string().min(8);

export const sharedSchemas = {
  username,
  email,
  password,
}