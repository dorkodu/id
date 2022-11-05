import { ApiRoutes } from "../types/api";

export const routes: ApiRoutes = {
  auth: "/api/auth/auth",
  signup: "/api/auth/signup",
  login: "/api/auth/login",
  logout: "/api/auth/logout",

  getUser: "/api/user/getUser",
  changeUsername: "/api/user/changeUsername",
  initiateChangeEmail: "/api/user/initiateChangeEmail",
  verifyNewEmailChangeEmail: "/api/user/verifyNewEmailChangeEmail",
  verifyOldEmailChangeEmail: "/api/user/verifyOldEmailChangeEmail",
  initiateChangePassword: "/api/user/initiateChangePassword",
  proceedChangePassword: "/api/user/proceedChangePassword",
  completeChangePassword: "/api/user/completeChangePassword",

  getCurrentSession: "/api/session/getCurrentSession",
  getSessions: "/api/session/getSessions",
  terminateSession: "/api/session/terminateSession",

  getAccesses: "/api/access/getAccesses",
  checkAccess: "/api/access/checkAccess",
  grantAccess: "/api/access/grantAccess",
  revokeAccess: "/api/access/revokeAccess",
}