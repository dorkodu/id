import { ApiCode, ApiError, ApiReq } from "../../../shared/types";
import { ReqType, ResType } from "../../types";

import * as bcrypt from "bcrypt";
import { validate } from "email-validator";
import { DB } from "../db";
import { fromBinary, sha256 } from "../utilty";
import { createToken } from "./token";

export async function login(req: ReqType, res: ResType, data: ApiReq[ApiCode.Login]) {
  if (!validate(data.email)) return res.send({ err: ApiError.SignupFail });
  if (data.password.length < 10) return res.send({ err: ApiError.SignupFail });

  const email = data.email;
  const password = data.password;

  const { result, err } = await DB.query(`SELECT id, password FROM user WHERE email=?`, [email]);

  // If an account with the corresponding email is not found
  if (result.length === 0 || err) return res.send({ err: ApiError.LoginFail });

  // Sha256 hash the pure password and then base64 encode it. Password from the database  
  // is the bcrypt hashed password. Convert it to utf8 and check if they match.
  if (!(await bcrypt.compare(sha256(password).toString("base64"), fromBinary(result[0].password, "utf8")))) return res.send({ err: ApiError.LoginFail });

  // Create a temporary token and redirect to the provided redirect uri with that token
  const token = await createToken(result[0].id);
  const redirectURI: string = (req.query as any)["redirect_uri"];
  res.redirect(`${redirectURI}?token=${token}`);
}