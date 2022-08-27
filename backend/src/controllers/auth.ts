import { NextFunction, Request, Response } from "express";
import { db } from "../db";
import { compareBinary, fromBinary, randomBytes, sha256, toBinary, utcTimestamp } from "../utilty";

async function auth(req: Request, res: Response, next: NextFunction) {

}

async function temporaryAuth(req: Request, res: Response, next: NextFunction) {

}

async function refreshAuth(req: Request, res: Response, next: NextFunction) {

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

async function deleteAuthToken(token: string): Promise<void> {
  // Split the token by ":" since the format of the auth token is selector:validator which is a base64url
  const splitToken = token.split(":");
  const selector = toBinary(splitToken[0], "base64url");
  const validator = toBinary(splitToken[1], "base64url");

  // Query using the selector to avoid timing attacks
  const { result, err } = await db.query(`
    SELECT id, validator FROM auth_token WHERE selector=?
  `, [selector]);

  // If no result or there is an error
  if (result.length === 0 || err) return;

  // Validator from the base64url is unhashed, so hash it and compare with the one from the query
  if (!compareBinary(sha256(validator), result[0].validator)) return;

  await db.query(`DELETE FROM auth_token WHERE id=?`, [result[0].id]);
}

async function checkAuthToken(token: string): Promise<number | null> {
  // Split the token by ":" since the format of the auth token is selector:validator which is a base64url
  const splitToken = token.split(":");
  const selector = toBinary(splitToken[0], "base64url");
  const validator = toBinary(splitToken[1], "base64url");

  // Query using the selector to avoid timing attacks
  const { result, err } = await db.query(`
   SELECT user_id, validator, expires FROM auth_token WHERE selector=?
 `, [selector]);

  // If no result or there is an error
  if (result.length === 0 || err) return null;

  // Validator from the base64url is unhashed, so hash it and compare with the one from the query
  if (!compareBinary(sha256(validator), result[0].validator)) return null;

  // Check if the token is expired, if so delete the token
  if (utcTimestamp() > result[0].expires) {
    deleteAuthToken(token);
    return null;
  }

  return result[0].user_id;
}

export default { auth, temporaryAuth, refreshAuth, login, signup, logout };