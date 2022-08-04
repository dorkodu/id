import { ApiCode, ApiReq } from "../../../shared/types";
import { ReqType, ResType } from "../../types";
import { deleteAuthToken } from "./auth";

export async function logout(req: ReqType, res: ResType, data: ApiReq[ApiCode.Logout]) {
  deleteAuthToken(data.token);

  return res.send({ data: {} });
}