import { Request } from "express";

function getIP(req: Request) {
  return req.headers["x-real-ip"] as string;
}

function intParse(str: string, def: number) {
  const parsed = parseInt(str, 10);
  return parsed === NaN ? def : parsed;
}

export const util = {
  getIP,
  intParse,
}