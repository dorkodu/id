import { z } from "zod";

export const authSchema = z.object({
  token: z.string()
}).strict();

export type AuthSchema = z.infer<typeof authSchema>;

export const signupSchema = z.object({
  username: z.string().regex(/^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,14}(?:[A-Za-z0-9_]))?)$/),
  email: z.string().email().max(320),
  password: z.string().min(8),
}).strict();

export type SignupSchema = z.infer<typeof signupSchema>;


export const loginSchema = z.object({
  username: z.string().optional(),
  email: z.string().optional(),
  password: z.string(),
}).strict();

export type LoginSchema = z.infer<typeof loginSchema>;

export const logoutSchema = z.object({
  token: z.string()
}).strict();

export type LogoutSchema = z.infer<typeof logoutSchema>;