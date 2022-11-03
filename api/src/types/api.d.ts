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
  InputGetCurrentSessionSchema,
  InputGetSessionsSchema,
  InputTerminateSessionSchema,
  OutputGetCurrentSessionSchema,
  OutputGetSessionsSchema,
  OutputTerminateSessionSchema
} from "../schemas/session"

import type {
  InputChangeEmailSchema,
  InputChangePasswordSchema,
  InputChangeUsernameSchema,
  InputGetUserSchema,
  OutputChangeEmailSchema,
  OutputChangePasswordSchema,
  OutputChangeUsernameSchema,
  OutputGetUserSchema
} from "../schemas/user"

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
  changeEmail: {
    path: "/api/user/changeEmail"
    input: InputChangeEmailSchema
    output: OutputChangeEmailSchema
  }
  changePassword: {
    path: "/api/user/changePassword"
    input: InputChangePasswordSchema
    output: OutputChangePasswordSchema
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
}
