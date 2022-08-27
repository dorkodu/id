import { validate } from "email-validator";
import { NextFunction, Request, Response } from "express";
import { db } from "../db";
import { checkUsername, compareBinary, fromBinary, randomBytes, sha256, toBinary, utcTimestamp } from "../utilty";
import * as bcrypt from "bcrypt";

async function auth(req: Request, res: Response, next: NextFunction) {
  const data: Partial<{ token: string | any }> = req.body;

  // Check if data is undefined
  if (data.token === undefined || typeof data.token !== "string")
    return res.status(404).send({});

  const userId = await checkAuthToken(data.token);
  if (userId === null) return res.status(404).send({});
  return res.status(200).send({ userId });
}

async function temporaryAuth(req: Request, res: Response, next: NextFunction) {
  const data: Partial<{ token: string | any }> = req.body;

  // Check if data is undefined
  if (data.token === undefined || typeof data.token !== "string")
    return res.status(404).send({});

  const userId = await checkTemporaryAuthToken(data.token);
  if (userId === null) return res.status(404).send({});
  const token = await createAuthToken(userId);
  if (token === null) return res.status(404).send({});
  return res.status(200).send({ token });
}

async function refreshAuth(req: Request, res: Response, next: NextFunction) {
  const data: Partial<{ token: string | any }> = req.body;

  // Check if data is undefined
  if (data.token === undefined || typeof data.token !== "string")
    return res.status(404).send({});

  const userId = await checkAuthToken(data.token);
  if (userId === null) return res.status(404).send({});

  await deleteAuthToken(data.token);

  const token = await createAuthToken(userId);
  if (token === null) return res.status(404).send({});

  return res.status(200).send({ token });
}

async function login(req: Request, res: Response, next: NextFunction) {
  const data: Partial<{ usernameOrEmail: string | any, password: string | any }> = req.body;

  // Check if data is undefined
  if (data.usernameOrEmail === undefined || typeof data.usernameOrEmail !== "string")
    return res.status(404).send({});
  if (data.password === undefined || typeof data.password !== "string")
    return res.status(404).send({});

  let username: string | null = null;
  let email: string | null = null;

  if (checkUsername(data.usernameOrEmail)) username = data.usernameOrEmail;
  else if (validate(data.usernameOrEmail)) email = data.usernameOrEmail;

  if (username === null && email === null) return res.status(404).send({});

  const { result, err } = username !== null ?
    await db.query(`SELECT id, password FROM user WHERE username=?`, [username]) :
    await db.query(`SELECT id, password FROM user WHERE email=?`, [email]);

  // If an account with the corresponding username/email is not found
  if (result.length === 0 || err) return res.status(404).send({});

  // Sha256 hash the pure password and then base64 encode it. Password from the database  
  // is the bcrypt hashed password. Convert it to utf8 and check if they match.
  if (!(await bcrypt.compare(sha256(data.password).toString("base64"), fromBinary(result[0].password, "utf8"))))
    return res.status(404).send({});

  const token = await createTemporaryAuthToken(result[0].id);
  if (token === null) return res.status(404).send({});

  const redirectURI = req.query["redirect_uri"];
  if (typeof redirectURI !== "string") return res.status(404).send({});

  res.redirect(`${redirectURI}?token=${token}`);
}

async function signup(req: Request, res: Response, next: NextFunction) {

}

async function logout(req: Request, res: Response, next: NextFunction) {

}

async function createAuthToken(userId: number): Promise<string | null> {
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
  return fromBinary(selector, "base64url") + ":" + fromBinary(validator, "base64url");
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

async function createTemporaryAuthToken(userId: number): Promise<string | null> {
  // Create the temporary token (32 bytes)
  const token = randomBytes(32);

  // Store the hash of the temporary token to be stored in the database
  const hash = sha256(token);

  // Set the expiration to 60 seconds from now since the token is for one-time use
  const expires = utcTimestamp() + 60;

  const { result, err } = await db.query(`
    INSERT INTO temporary_token (token, expires, user_id)
    VALUES (?, ?, ?)
  `, [hash, expires, userId]);

  if (err) return null;

  // Convert the token to base64url since it will be sent as query parameter in the url
  return fromBinary(token, "base64url");
}

async function deleteTemporaryAuthToken(tokenId: number): Promise<void> {
  await db.query(`DELETE FROM temporary_token WHERE id=?`, [tokenId]);
}

async function checkTemporaryAuthToken(token: string): Promise<number | null> {
  // Convert token to binary from base64url and sha256 hash it since it's stored as a hash in the database
  const tokenHash = sha256(toBinary(token, "base64url"));

  const { result, err } = await db.query(`SELECT id, user_id, expires FROM temporary_token WHERE token=?`, [tokenHash]);

  // If no result or there is an error
  if (result.length === 0 || err) return null;

  // After validating that the token exists, since this token is meant to be used only once, 
  // delete the token. No need to use await since it's nothing to do with other logic.
  deleteTemporaryAuthToken(result[0].id);

  // Check if the token is expired
  if (utcTimestamp() > result[0].expires) return null;

  // Return the user id
  return result[0].user_id;
}


export default { auth, temporaryAuth, refreshAuth, login, signup, logout };