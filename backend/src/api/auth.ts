import { ApiCode, ApiReq, ApiRes, ApiError } from "../../../shared/types";
import { ReqType, ResType } from "../../types";

import { DB } from "../db";
import { compareBinary, fromBinary, randomBytes, sha256, toBinary, utcTimestamp } from "../utilty";

export async function auth(req: ReqType, res: ResType, data: ApiReq[ApiCode.Auth]): Promise<ApiRes[ApiCode.Auth]> {
  // Split the token by ":" since the format of the auth token is selector:validator which is a base64url
  const token = data.token.split(":");
  const selector = toBinary(token[0], "base64url");
  const validator = toBinary(token[1], "base64url");

  // Query using the selector to avoid timing attacks
  const { result, err } = await DB.query(`
    SELECT user_id, validator, expires FROM auth_token WHERE selector=?
  `, [selector]);

  // If no result or there is an error
  if (result.length === 0 || err) return res.send({ err: ApiError.AuthFail });

  // Check if the token is expired
  if (utcTimestamp() > result[0].expires) return res.send({ err: ApiError.AuthFail });

  // Validator from the base64url is unhashed, so hash it and compare with the one from the query
  if (compareBinary(sha256(validator), result[0].validator)) return res.send({ err: ApiError.AuthFail });

  return res.send({ data: { userId: result[0].user_id } });
}

export async function createAuthToken(userId: number): Promise<string | null> {
  // Create selector (16 bytes) and validator (32 bytes)
  const selector = randomBytes(16);
  const validator = randomBytes(32);

  // Hash the validator (only used for storing in the database)
  const validatorHash = sha256(validator);

  // Set the expiration date to 1 month from now
  const expires = utcTimestamp() + 60 * 60 * 24 * 30;

  const { result, err } = await DB.query(`
    INSERT INTO auth_token (user_id, selector, validator, expires)
    VALUES (?, ?, ?, ?)
  `, [userId, selector, validatorHash, expires]);

  if (err) return null;

  // Convert token to it's final form by base64url-ing both selector & validator
  return fromBinary(selector, "base64url") + ":" + fromBinary(validator, "base64url");
}

async function deleteAuthToken() {

}