import sage from "@dorkodu/sage-server";
import { NextFunction, Request, Response } from "express";

import access from "./access";

export interface RouterContext {
  req: Request;
  res: Response;
  next: NextFunction;
}

export type Router = typeof router
export const router = sage.router(
  {} as RouterContext,
  {
    getAccesses: access.getAccesses,
    grantAccess: access.grantAccess,
    revokeAccess: access.revokeAccess,
  }
)