import { z } from "zod";

const username = z.string().regex(/^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,14}(?:[A-Za-z0-9_]))?)$/);
const email = z.string().max(320);
const password = z.string().min(8);

export const authSchema = z.object({

}).strict();

export type AuthSchema = z.infer<typeof authSchema>;

export const signupSchema = z.object({
  username,
  email,
  password,
}).strict();

export type SignupSchema = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  username: username.optional(),
  email: email.optional(),
  password: password,
}).strict();

export type LoginSchema = z.infer<typeof loginSchema>;

export const logoutSchema = z.object({

}).strict();

export type LogoutSchema = z.infer<typeof logoutSchema>;