import { ApiCode, ApiReq, ApiRes, ApiError } from "../../../shared/types";
import { ReqType, ResType } from "../../types";

import { DB } from "../db";
import { fromBinary, randomBytes, sha256, toBinary, utcTimestamp } from "../utilty";

export async function auth(req: ReqType, res: ResType, data: ApiReq[ApiCode.Auth]): Promise<ApiRes[ApiCode.Auth]> {
  const token = data.token.split(":");
  const selector = toBinary(token[0], "base64url");
  const validator = toBinary(token[1], "base64url");

  const { result, err } = await DB.query(`
    SELECT user_id, validator, expires FROM auth_token WHERE selector=?
  `, [selector]);

  if (result.length === 0 || err) return res.send({ err: ApiError.AuthFail });

  if (utcTimestamp() > result[0].expires) return res.send({ err: ApiError.AuthFail });
  if (sha256(validator).compare(result[0].validator)) return res.send({ err: ApiError.AuthFail });

  return res.send({ data: { userId: result[0].user_id } });
}

export async function createAuthToken(userId: number): Promise<string | null> {
  const selector = randomBytes(16);
  const validator = randomBytes(32);
  const validatorHash = sha256(validator);
  const expires = utcTimestamp() + 60 * 60 * 24 * 30;

  const { result, err } = await DB.query(`
    INSERT INTO auth_token (user_id, selector, validator, expires)
    VALUES (?, ?, ?, ?)
  `, [userId, selector, validatorHash, expires]);

  if (err) return null;
  return fromBinary(selector, "base64url") + ":" + fromBinary(validator, "base64url");
}

async function deleteAuthToken() {

}