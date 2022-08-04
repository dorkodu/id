import { ApiCode, ApiError, ApiReq } from "../../../shared/types";
import { ReqType, ResType } from "../../types";

import { DB } from "../db";
import { convertEncoding, fromBinary, randomBytes, sha256, toBinary, utcTimestamp } from "../utilty";
import { createAuthToken } from "./auth";

export async function token(req: ReqType, res: ResType, data: ApiReq[ApiCode.Token]) {
  if (!verifyClient(data.clientId, data.clientSecret)) return res.send({ err: ApiError.TokenFail });

  const userId = await fetchToken(data.token);
  if (userId === null) return res.send({ err: ApiError.TokenFail });

  const authToken = await createAuthToken(userId);
  if (authToken === null) return res.send({ err: ApiError.TokenFail });

  return res.send({ data: { token: authToken } });
}

async function verifyClient(clientId: string, clientSecret: string) {
  const clientIdBuffer = toBinary(clientId, "base64");
  const clientSecretBuffer = toBinary(clientSecret, "base64");

  const { result, err } = await DB.query(`SELECT client_Secret FROM app WHERE client_id=?`, [clientIdBuffer]);

  if (result.length === 0 || err) return false;
  return sha256(clientSecretBuffer) === result[0].client_secret;
}

async function fetchToken(token: string): Promise<null | number> {
  const tokenBuffer = sha256(Buffer.from(token, "base64url"));

  const { result, err } = await DB.query(`SELECT user_id, expires FROM temporary_token WHERE token=?`, [tokenBuffer]);

  if (result.length === 0 || err) return null;
  if (utcTimestamp() > result[0].expires) return null;
  return result[0].user_id;
}

export async function createToken(userId: number): Promise<string | null> {
  const token = randomBytes(32);
  const hash = sha256(token);

  const expires = utcTimestamp() + 60;

  const { result, err } = await DB.query(`
    INSERT INTO temporary_token (token, expires, user_id)
    VALUES (?, ?, ?)
  `, [hash, expires, userId]);

  if (err) return null;
  return fromBinary(token, "base64url");

}