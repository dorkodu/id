import { ApiCode, ApiError, ApiReq } from "../../../shared/types";
import { ReqType, ResType } from "../../types";

import { DB } from "../db";
import { compareBinary, fromBinary, randomBytes, sha256, toBinary, utcTimestamp } from "../utilty";
import { createAuthToken } from "./auth";

export async function token(req: ReqType, res: ResType, data: ApiReq[ApiCode.Token]) {
  // Verify that the request comes from a trusted client (like trekie's backend)
  if (!await verifyClient(data.clientId, data.clientSecret)) return res.send({ err: ApiError.TokenFail });

  // Try to get the user id from the temporary token
  const userId = await fetchToken(data.token);
  if (userId === null) return res.send({ err: ApiError.TokenFail });

  // Create a authorization token for that user id
  const authToken = await createAuthToken(userId);
  if (authToken === null) return res.send({ err: ApiError.TokenFail });

  return res.send({ data: { token: authToken } });
}

async function verifyClient(clientId: string, clientSecret: string) {
  // Both client id and secret are encoded as base64 so convert to binary first
  const id = toBinary(clientId, "base64");
  const secret = toBinary(clientSecret, "base64");

  // Query the client secret using the client id
  const { result, err } = await DB.query(`SELECT client_secret FROM app WHERE client_id=?`, [id]);

  // If no client exists with that id
  if (result.length === 0 || err) return false;

  // Hash the unhashed secret from the request and compare with the one from the database
  return compareBinary(sha256(secret), result[0].client_secret)
}

async function fetchToken(token: string): Promise<null | number> {
  // Convert token to binary from base64url and sha256 hash it since it's stored as a hash in the database
  const tokenBuffer = sha256(toBinary(token, "base64url"));

  const { result, err } = await DB.query(`SELECT user_id, expires FROM temporary_token WHERE token=?`, [tokenBuffer]);

  // If no result or there is an error
  if (result.length === 0 || err) return null;

  // Check if the token is expired
  if (utcTimestamp() > result[0].expires) return null;

  // Return the user id which will be used by the client's backend
  return result[0].user_id;
}

export async function createToken(userId: number): Promise<string | null> {
  // Create the temporary token (32 bytes)
  const token = randomBytes(32);

  // Store the hash of the temporary token to be stored in the database
  const hash = sha256(token);

  // Set the expiration to 60 seconds from now since the token is for one-time use
  const expires = utcTimestamp() + 60;

  const { result, err } = await DB.query(`
    INSERT INTO temporary_token (token, expires, user_id)
    VALUES (?, ?, ?)
  `, [hash, expires, userId]);

  if (err) return null;

  // Convert the token to base64url since it will be sent as query parameter in the url
  return fromBinary(token, "base64url");
}