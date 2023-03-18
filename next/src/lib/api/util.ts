import type { NextApiRequest } from "next";

function getIP(req: NextApiRequest) {
  return req.headers["x-real-ip"] as string;
}

function intParse(str: string, _default: number) {
  const parsed = parseInt(str, 10);
  return Number.isNaN(parsed) ? _default : parsed;
}

export const util = {
  getIP,
  intParse,
}