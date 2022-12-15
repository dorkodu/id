import sage from "@dorkodu/sage-server";
import { NextFunction, Request, Response } from "express";

import user from "./user";
import session from "./session";
import access from "./access";
import external from "./external";

export interface RouterContext {
  req: Request;
  res: Response;
  next: NextFunction;
}

export type Router = typeof router
export const router = sage.router(
  {} as RouterContext,
  {
    /* user */
    getUser: user.getUser,

    changeUsername: user.changeUsername,

    initiateEmailChange: user.initiateEmailChange,
    confirmEmailChange: user.confirmEmailChange,
    revertEmailChange: user.revertEmailChange,

    initiatePasswordChange: user.initiatePasswordChange,
    confirmPasswordChange: user.confirmPasswordChange,

    /* session */
    getCurrentSession: session.getCurrentSession,
    getSessions: session.getSessions,
    terminateSession: session.terminateSession,

    /* access */
    getAccesses: access.getAccesses,
    grantAccess: access.grantAccess,
    revokeAccess: access.revokeAccess,

    /* external */
    getAccessToken: external.getAccessToken,
    checkAccess: external.checkAccess,
    getUserData: external.getUserData,
  }
)