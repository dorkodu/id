import { ApiCode, ApiError, ApiReq, ApiRes } from "../../../shared/types";
import { ReqType, ResType } from "../../types";

import * as bcrypt from "bcrypt";
import { validate } from "email-validator";
import { DB } from "../db";
import { sha256, utcTimestamp } from "../utilty";
import { createToken } from "./token";

export async function signup(req: ReqType, res: ResType, data: ApiReq[ApiCode.Signup]) {
  // Check if email is valid
  if (!validate(data.email)) return res.send({ err: ApiError.SignupFail });

  // TODO: Implement advanced password strength checker
  // Check if password is not less than 10 characters
  if (data.password.length < 10) return res.send({ err: ApiError.SignupFail });

  const email = data.email;
  // Since bcrypt only accepts first 72 bytes and stops at the null bytes,hash the
  // password to get a fixed length of 32 bytes and base64 encode to avoid null bytes
  const password = await bcrypt.hash(sha256(data.password).toString("base64"), 10);
  // Timestamp that the user signed up
  const date = utcTimestamp();

  const { result, err } = await DB.query(`
    INSERT INTO user  (email, password, date)
    VALUES (?, ?, ?)
  `, [email, password, date]);

  if (err) return res.send({ err: ApiError.SignupFail });

  // Create a temporary token and redirect to the provided redirect uri with that token
  const token = await createToken(result.insertId);
  const redirectURI: string = (req.query as any)["redirect_uri"];
  res.redirect(`${redirectURI}?token=${token}`);
}