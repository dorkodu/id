import { ApiCode, ApiError, ApiReq, ApiRes } from "../../../shared/types";
import { ReqType, ResType } from "../../types";

import * as bcrypt from "bcrypt";
import { validate } from "email-validator";
import { DB } from "../db";
import { sha256, utcTimestamp } from "../utilty";

export async function signup(req: ReqType, res: ResType, data: ApiReq[ApiCode.Signup]) {
  if (!validate(data.email)) return res.send({ err: ApiError.SignupFail });
  if (data.password.length < 10) return res.send({ err: ApiError.SignupFail });

  const email = data.email;
  const password = await bcrypt.hash(sha256(data.password, "base64"), 10);
  const date = utcTimestamp();

  const { result, err } = await DB.query(`
    INSERT INTO user  (email, password, date)
    VALUES (?, ?, ?)
  `, [email, password, date]);

  if (err) return res.send({ err: ApiError.SignupFail });

  const redirectURI: string = (req.query as any)["redirect_uri"];
  res.redirect(`${redirectURI}?token=${}`)

  return res.send({});
}