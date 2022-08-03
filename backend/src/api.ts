import { ApiCode, ApiReqSchema } from "../../shared/types";
import { ReqType, ResType } from "../types";

import { auth, getAuthToken } from "./api/auth";
import { login } from "./api/login";
import { signup } from "./api/signup";

export class Api {
  public static async handle(req: ReqType, res: ResType) {
    console.log(req.body);
    if (!req.body) { res.status(500); return res.send(); }
    const schema: ApiReqSchema<any> = req.body as ApiReqSchema<any>;

    switch (schema.type) {
      case ApiCode.Auth: return await auth(req, res, schema.data);
      case ApiCode.Login: return await login(req, res, schema.data);
      case ApiCode.Login: return await signup(req, res, schema.data);
      case ApiCode.GetAuthToken: return await getAuthToken(req, res, schema.data);
      default: break;
    }

    res.status(500);
    res.send();
  }
}