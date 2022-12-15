import sage from "@dorkodu/sage-server";
import { NextFunction, Request, Response } from "express";

import auth from "./auth";
import user from "./user";
import session from "./session";
import access from "./access";
import external from "./external";

export interface RouterContext {
  readonly req: Request;
  readonly res: Response;
  readonly next: NextFunction;

  userId?: number;
  tokenId?: number;
}

export type Router = typeof router
export const router = sage.router(
  {} as RouterContext,
  {
    /* auth */
    auth: auth.auth,
    initiateSignup: auth.initiateSignup,
    confirmSignup: auth.confirmSignup,
    login: auth.login,
    logout: auth.logout,

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