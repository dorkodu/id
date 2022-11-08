import type {
  InputAuthSchema,
  InputConfirmSignupSchema,
  InputInitiateSignupSchema,
  InputLoginSchema,
  InputLogoutSchema,
  OutputAuthSchema,
  OutputConfirmSignupSchema,
  OutputInitiateSignupSchema,
  OutputLoginSchema,
  OutputLogoutSchema,
} from "../schemas/auth"

import type {
  InputChangeUsernameSchema,
  InputConfirmEmailChangeSchema,
  InputConfirmPasswordChangeSchema,
  InputGetUserSchema,
  InputInitiateEmailChangeSchema,
  InputInitiatePasswordChangeSchema,
  InputRevertEmailChangeSchema,
  OutputChangeUsernameSchema,
  OutputConfirmEmailChangeSchema,
  OutputConfirmPasswordChangeSchema,
  OutputGetUserSchema,
  OutputInitiateEmailChangeSchema,
  OutputInitiatePasswordChangeSchema,
  OutputRevertEmailChangeSchema,
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
  initiateSignup: {
    path: "/api/auth/initiateSignup"
    input: InputInitiateSignupSchema
    output: OutputInitiateSignupSchema
  }
  confirmSignup: {
    path: "/api/auth/confirmSignup"
    input: InputConfirmSignupSchema
    output: OutputConfirmSignupSchema
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
  initiateEmailChange: {
    path: "/api/user/initiateEmailChange",
    input: InputInitiateEmailChangeSchema,
    output: OutputInitiateEmailChangeSchema,
  }
  confirmEmailChange: {
    path: "/api/user/confirmEmailChange",
    input: InputConfirmEmailChangeSchema,
    output: OutputConfirmEmailChangeSchema,
  }
  revertEmailChange: {
    path: "/api/user/revertEmailChange",
    input: InputRevertEmailChangeSchema,
    output: OutputRevertEmailChangeSchema,
  }
  initiatePasswordChange: {
    path: "/api/user/initiatePasswordChange",
    input: InputInitiatePasswordChangeSchema,
    output: OutputInitiatePasswordChangeSchema,
  }
  confirmPasswordChange: {
    path: "/api/user/confirmPasswordChange",
    input: InputConfirmPasswordChangeSchema,
    output: OutputConfirmPasswordChangeSchema,
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
