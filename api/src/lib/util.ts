import { Request } from "express";

function getIP(req: Request) {
  return req.headers["x-real-ip"] as string;
}

export const util = {
  getIP,
}