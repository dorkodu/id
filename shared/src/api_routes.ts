import { ApiDetails } from "./api_details";

export type ApiRoutes = { [K in keyof ApiDetails]: ApiDetails[K]["path"] }

export const apiRoutes: ApiRoutes = {
  auth: "/api/auth/auth",
  initiateSignup: "/api/auth/initiateSignup",
  confirmSignup: "/api/auth/confirmSignup",
  login: "/api/auth/login",
  logout: "/api/auth/logout",

  getUser: "/api/user/getUser",
  changeUsername: "/api/user/changeUsername",
  initiateEmailChange: "/api/user/initiateEmailChange",
  confirmEmailChange: "/api/user/confirmEmailChange",
  revertEmailChange: "/api/user/revertEmailChange",
  initiatePasswordChange: "/api/user/initiatePasswordChange",
  confirmPasswordChange: "/api/user/confirmPasswordChange",

  getCurrentSession: "/api/session/getCurrentSession",
  getSessions: "/api/session/getSessions",
  terminateSession: "/api/session/terminateSession",

  getAccesses: "/api/access/getAccesses",
  checkAccess: "/api/access/checkAccess",
  grantAccess: "/api/access/grantAccess",
  revokeAccess: "/api/access/revokeAccess",
}