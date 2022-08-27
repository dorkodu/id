import { NextFunction, Request, Response } from "express";
import { db } from "../db";
import { fromBinary, randomBytes, sha256, utcTimestamp } from "../utilty";

async function auth(req: Request, res: Response, next: NextFunction) {

}

async function temporaryAuth(req: Request, res: Response, next: NextFunction) {

}

async function login(req: Request, res: Response, next: NextFunction) {

}

async function signup(req: Request, res: Response, next: NextFunction) {

}

async function logout(req: Request, res: Response, next: NextFunction) {

}

async function createAuthToken(userId: number): Promise<{ token: string, expires: number } | null> {
  // Create selector (16 bytes) and validator (32 bytes)
  const selector = randomBytes(16);
  const validator = randomBytes(32);

  // Hash the validator (only used for storing in the database)
  const validatorHash = sha256(validator);

  // Set the expiration date to 1 month from now
  const expires = utcTimestamp() + 60 * 60 * 24 * 30;

  const { result, err } = await db.query(`
  INSERT INTO auth_token (user_id, selector, validator, expires)
  VALUES (?, ?, ?, ?)
`, [userId, selector, validatorHash, expires]);

  if (err) return null;

  // Convert token to it's final form by base64url-ing both selector & validator
  return {
    token: fromBinary(selector, "base64url") + ":" + fromBinary(validator, "base64url"),
    expires: expires
  };
}

async function deleteAuthToken() {

}

async function checkAuthToken() {

}

export default { auth, temporaryAuth, login, signup, logout };