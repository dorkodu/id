import { ApiCode, ApiReq, ApiRes, ApiError } from "../../../shared/types";
import { ReqType, ResType } from "../../types";

import { DB } from "../db";
import { base64urlDecode, convertEncoding, randomBytes, sha256, utcTimestamp } from "../utilty";

export async function auth(req: ReqType, res: ResType, data: ApiReq[ApiCode.Auth]): Promise<ApiRes[ApiCode.Auth]> {
  const token = data.token.split(":");
  const selector = base64urlDecode(token[0]);
  const validator = base64urlDecode(token[1]);

  const { result, err } = await DB.query(`
    SELECT user_id, validator, expires FROM auth_token WHERE selector=?
  `, [selector]);

  if (result.length === 0 || err) return res.send({ err: ApiError.AuthFail });

  if (utcTimestamp() > result[0].expires) return res.send({ err: ApiError.AuthFail });
  if (sha256(validator, "binary") !== result[0].validator) return res.send({ err: ApiError.AuthFail });

  return res.send({ data: { userId: result[0].user_id } });
}

export async function createAuthToken(userId: number): Promise<string | null> {
  const selector = randomBytes(16, "binary");
  const validator = randomBytes(32, "binary");
  const validatorHash = sha256(validator, "binary");
  const expires = utcTimestamp() + 60 * 60 * 24 * 30;

  const { result, err } = await DB.query(`
    INSERT INTO auth_token (user_id, selector, validator, expires)
    VALUES (?, ?, ?, ?)
  `, [userId, selector, validatorHash, expires]);

  if (err) return null;
  return convertEncoding(selector, "base64url") + ":" + convertEncoding(validator, "base64url");
}

async function deleteAuthToken() {

}