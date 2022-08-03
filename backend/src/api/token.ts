import { ApiCode, ApiError, ApiReq } from "../../../shared/types";
import { ReqType, ResType } from "../../types";

import { DB } from "../db";
import { convertEncoding, randomBytes, sha256, utcTimestamp } from "../utilty";
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
  clientId = convertEncoding(clientId, "base64", "binary");
  clientSecret = convertEncoding(clientSecret, "base64", "binary");

  const { result, err } = await DB.query(`SELECT client_Secret FROM app WHERE client_id=?`, [clientId]);

  if (result.length === 0 || err) return false;
  return sha256(clientSecret, "binary") === result[0].client_secret;
}

async function fetchToken(token: string): Promise<null | number> {
  token = sha256(convertEncoding(token, "base64url", "binary"), "binary");

  const { result, err } = await DB.query(`SELECT user_id, expires FROM temporary_token WHERE token=?`, [token]);
  console.log(result);

  if (result.length === 0 || err) return null;
  if (utcTimestamp() > result[0].expires) return null;
  return result[0].user_id;
}

export async function createToken(userId: number): Promise<string | null> {
  const token = randomBytes(32, "binary");
  const hash = sha256(token, "binary");

  const expires = utcTimestamp() + 60;

  const { result, err } = await DB.query(`
    INSERT INTO temporary_token (token, expires, user_id)
    VALUES (?, ?, ?)
  `, [hash, expires, userId]);

  if (err) return null;
  return convertEncoding(token, "binary", "base64url");
}