import { ApiCode, ApiError, ApiReq } from "../../../shared/types";
import { ReqType, ResType } from "../../types";

import { DB } from "../db";
import { sha256, utcTimestamp } from "../utilty";

export async function token(req: ReqType, res: ResType, data: ApiReq[ApiCode.Token]) {
  if (!verifyClient(data.clientId, data.clientSecret)) return res.send({ err: ApiError.TokenFail });

  const userId = fetchToken(data.token);
  if (userId === null) return res.send({ err: ApiError.TokenFail });

}

async function verifyClient(clientId: string, clientSecret: string) {
  const { result, err } = await DB.query(`SELECT client_Secret FROM app WHERE client_id=?`, [clientId]);

  if (result.length === 0 || err) return false;
  return sha256(clientSecret, "binary") === result[0].client_secret;
}

async function fetchToken(token: string): Promise<null | number> {
  const { result, err } = await DB.query(`SELECT user_id, expires FROM temporary_token WHERE token=?`, [token]);

  if (result.length === 0 || err) return null;
  if (utcTimestamp() > result[0].expires) return null;
  return result[0].user_id;
}

async function createToken() {

}

async function deleteToken() {

}