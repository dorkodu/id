import type { ApiRoutes } from "../../api/src/types/api";
import type { EmailType } from "../../api/src/types/email_type";

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

export const emailTypes: EmailType = {
  notifyNewLocation: "new_location",
  confirmEmail: "confirm_email",
  confirmEmailChange: "confirm_email_change",
  revertEmailChange: "revert_email_change",
  confirmPasswordChange: "confirm_password_change",
}