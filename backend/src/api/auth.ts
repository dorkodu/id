import { ApiCode, ApiReq, ApiRes, ApiError } from "../../../shared/types";
import { ReqType, ResType } from "../../types";

import { DB } from "../db";

export async function auth(req: ReqType, res: ResType, data: ApiReq[ApiCode.Auth]): Promise<ApiRes[ApiCode.Auth]> {
  const token = data.token.split(":");
  const selector = token[0];
  const validator = token[1];

  const { result, err } = await DB.query(`
    SELECT user_id, validator, expires FROM auth_token WHERE selector=?
  `, [selector]);

  if (result.length === 0 || err) return { err: ApiError.AuthFail };

  if (Date.now() > result[0].expires) return { err: ApiError.AuthFail };

  return { data: { userId: result[0].user_id } };
}