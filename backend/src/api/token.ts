import { ApiCode, ApiError, ApiReq } from "../../../shared/types";
import { ReqType, ResType } from "../../types";

import { sha256 } from "crypto-hash";
import base64url from "base64url";
import { DB } from "../db";

export async function token(req: ReqType, res: ResType, data: ApiReq[ApiCode.Token]) {
  if (!verifyClient(req, res, data.clientId, data.clientSecret)) return res.send({ err: ApiError.TokenFail });


}

async function verifyClient(req: ReqType, res: ResType, clientId: string, clientSecret: string) {
  const { result, err } = await DB.query(`SELECT client_Secret FROM app WHERE client_id=?`, [clientId]);

  if (result.length === 0 || err) return res.send({ err: ApiError.TokenFail });

}