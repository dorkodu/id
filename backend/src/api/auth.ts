import { ApiCode, ApiReq, ApiRes, ApiError } from "../../../shared/types";
import { ReqType, ResType } from "../../types";

import { DB } from "../db";

import { sha256 } from "crypto-hash";
import base64url from "base64url";

export async function auth(req: ReqType, res: ResType, data: ApiReq[ApiCode.Auth]): Promise<ApiRes[ApiCode.Auth]> {
  const token = data.token.split(":");
  const selector = base64url.toBuffer(token[0]);
  const validator = base64url.toBuffer(token[1]);

  const { result, err } = await DB.query(`
    SELECT user_id, validator, expires FROM auth_token WHERE selector=?
  `, [selector]);

  if (result.length === 0 || err) return res.send({ err: ApiError.AuthFail });

  if (Date.now() > result[0].expires) return res.send({ err: ApiError.AuthFail });
  if (await sha256(validator, { outputFormat: "buffer" }) !== result[0].validator) return res.send({ err: ApiError.AuthFail });

  return res.send({ data: { userId: result[0].user_id } });
}