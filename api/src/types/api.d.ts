import type {
  InputAuthSchema,
  InputLoginSchema,
  InputLogoutSchema,
  InputSignupSchema,
  OutputAuthSchema,
  OutputLoginSchema,
  OutputLogoutSchema,
  OutputSignupSchema
} from "../schemas/auth"

import type {
  InputChangeUsernameSchema,
  InputCompleteChangePasswordSchema,
  InputGetUserSchema,
  InputInitiateChangeEmailSchema,
  InputInitiateChangePasswordSchema,
  InputProceedChangePasswordSchema,
  InputVerifyNewEmailChangeEmailSchema,
  InputVerifyOldEmailChangeEmailSchema,
  OutputChangeUsernameSchema,
  OutputCompleteChangePasswordSchema,
  OutputGetUserSchema,
  OutputInitiateChangeEmailSchema,
  OutputInitiateChangePasswordSchema,
  OutputProceedChangePasswordSchema,
  OutputVerifyNewEmailChangeEmailSchema,
  OutputVerifyOldEmailChangeEmailSchema
} from "../schemas/user"

import type {
  InputGetCurrentSessionSchema,
  InputGetSessionsSchema,
  InputTerminateSessionSchema,
  OutputGetCurrentSessionSchema,
  OutputGetSessionsSchema,
  OutputTerminateSessionSchema
} from "../schemas/session"


import type {
  InputCheckAccessSchema,
  InputGetAccessesSchema,
  InputGrantAccessSchema,
  InputRevokeAccessSchema,
  OutputCheckAccessSchema,
  OutputGetAccessesSchema,
  OutputGrantAccessSchema,
  OutputRevokeAccessSchema
} from "../schemas/access"

export type ApiRoutes = { [K in keyof ApiDetail]: ApiDetail[K]["path"] }

export interface ApiDetail {
  auth: {
    path: "/api/auth/auth"
    input: InputAuthSchema
    output: OutputAuthSchema
  }
  signup: {
    path: "/api/auth/signup"
    input: InputSignupSchema
    output: OutputSignupSchema
  }
  login: {
    path: "/api/auth/login"
    input: InputLoginSchema
    output: OutputLoginSchema
  }
  logout: {
    path: "/api/auth/logout"
    input: InputLogoutSchema
    output: OutputLogoutSchema
  }

  getUser: {
    path: "/api/user/getUser"
    input: InputGetUserSchema
    output: OutputGetUserSchema
  }
  changeUsername: {
    path: "/api/user/changeUsername"
    input: InputChangeUsernameSchema
    output: OutputChangeUsernameSchema
  }
  initiateChangeEmail: {
    path: "/api/user/initiateChangeEmail",
    input: InputInitiateChangeEmailSchema,
    output: OutputInitiateChangeEmailSchema,
  }
  verifyNewEmailChangeEmail: {
    path: "/api/user/verifyNewEmailChangeEmail",
    input: InputVerifyNewEmailChangeEmailSchema,
    output: OutputVerifyNewEmailChangeEmailSchema,
  }
  verifyOldEmailChangeEmail: {
    path: "/api/user/verifyOldEmailChangeEmail",
    input: InputVerifyOldEmailChangeEmailSchema,
    output: OutputVerifyOldEmailChangeEmailSchema,
  }
  initiateChangePassword: {
    path: "/api/user/initiateChangePassword",
    input: InputInitiateChangePasswordSchema,
    output: OutputInitiateChangePasswordSchema,
  }
  proceedChangePassword: {
    path: "/api/user/proceedChangePassword",
    input: InputProceedChangePasswordSchema,
    output: OutputProceedChangePasswordSchema,
  }
  completeChangePassword: {
    path: "/api/user/completeChangePassword",
    input: InputCompleteChangePasswordSchema,
    output: OutputCompleteChangePasswordSchema,
  }

  getCurrentSession: {
    path: "/api/session/getCurrentSession"
    input: InputGetCurrentSessionSchema
    output: OutputGetCurrentSessionSchema
  }
  getSessions: {
    path: "/api/session/getSessions"
    input: InputGetSessionsSchema
    output: OutputGetSessionsSchema
  }
  terminateSession: {
    path: "/api/session/terminateSession"
    input: InputTerminateSessionSchema
    output: OutputTerminateSessionSchema
  }

  getAccesses: {
    path: "/api/access/getAccesses",
    input: InputGetAccessesSchema,
    output: OutputGetAccessesSchema,
  }
  checkAccess: {
    path: "/api/access/checkAccess",
    input: InputCheckAccessSchema,
    output: OutputCheckAccessSchema,
  }
  grantAccess: {
    path: "/api/access/grantAccess",
    input: InputGrantAccessSchema,
    output: OutputGrantAccessSchema,
  }
  revokeAccess: {
    path: "/api/access/revokeAccess",
    input: InputRevokeAccessSchema,
    output: OutputRevokeAccessSchema,
  }
}
