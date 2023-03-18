import sage from "@dorkodu/sage-server";
import type { NextApiRequest, NextApiResponse } from "next"

import auth from "./auth";
import user from "./user";
import session from "./session";
import access from "./access";
import external from "./external";

export interface SchemaContext {
  readonly req: NextApiRequest;
  readonly res: NextApiResponse;

  triedAuth?: boolean;
  userId?: string;
  sessionId?: string;
}

export type Schema = typeof schema
export const schema = sage.schema(
  {} as SchemaContext,
  {
    /* auth */
    auth: auth.auth,

    signup: auth.signup,
    confirmSignup: auth.confirmSignup,

    login: auth.login,
    verifyLogin: auth.verifyLogin,

    logout: auth.logout,

    /* user */
    getUser: user.getUser,

    editProfile: user.editProfile,

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
    expireAccessToken: external.expireAccessToken,
    checkAccess: external.checkAccess,
    getUserData: external.getUserData,
  }
)