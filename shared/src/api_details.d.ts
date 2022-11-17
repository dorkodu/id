import type { AuthSchema } from "../../api/src/schemas/auth"
import type { UserSchema } from "../../api/src/schemas/user"
import type { SessionSchema } from "../../api/src/schemas/session"
import type { AccessSchema } from "../../api/src/schemas/access"

export interface ApiDetails {
  auth: {
    input: AuthSchema.InputAuth
    output: AuthSchema.OutputAuth
  }
  initiateSignup: {
    input: AuthSchema.InputInitiateSignup
    output: AuthSchema.OutputInitiateSignup
  }
  confirmSignup: {
    input: AuthSchema.InputConfirmSignup
    output: AuthSchema.OutputConfirmSignup
  }
  login: {
    input: AuthSchema.InputLogin
    output: AuthSchema.OutputLogin
  }
  logout: {
    input: AuthSchema.InputLogout
    output: AuthSchema.OutputLogout
  }

  getUser: {
    input: UserSchema.InputGetUser
    output: UserSchema.OutputGetUser
  }
  changeUsername: {
    input: UserSchema.InputChangeUsername
    output: UserSchema.OutputChangeUsername
  }
  initiateEmailChange: {
    input: UserSchema.InputInitiateEmailChange
    output: UserSchema.OutputInitiateEmailChange
  }
  confirmEmailChange: {
    input: UserSchema.InputConfirmEmailChange
    output: UserSchema.OutputConfirmEmailChange
  }
  revertEmailChange: {
    input: UserSchema.InputRevertEmailChange
    output: UserSchema.OutputRevertEmailChange
  }
  initiatePasswordChange: {
    input: UserSchema.InputInitiatePasswordChange
    output: UserSchema.OutputInitiatePasswordChange
  }
  confirmPasswordChange: {
    input: UserSchema.InputConfirmPasswordChange
    output: UserSchema.OutputConfirmPasswordChange
  }

  getCurrentSession: {
    input: SessionSchema.InputGetCurrentSession
    output: SessionSchema.OutputGetCurrentSession
  }
  getSessions: {
    input: SessionSchema.InputGetSessions
    output: SessionSchema.OutputGetSessions
  }
  terminateSession: {
    input: SessionSchema.InputTerminateSession
    output: SessionSchema.OutputTerminateSession
  }

  getAccesses: {
    input: AccessSchema.InputGetAccesses
    output: AccessSchema.OutputGetAccesses
  }
  checkAccess: {
    input: AccessSchema.InputCheckAccess
    output: AccessSchema.OutputCheckAccess
  }
  grantAccess: {
    input: AccessSchema.InputGrantAccess
    output: AccessSchema.OutputGrantAccess
  }
  revokeAccess: {
    input: AccessSchema.InputRevokeAccess
    output: AccessSchema.OutputRevokeAccess
  }
}
