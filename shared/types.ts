export enum ApiCode {
  Auth = "auth",

  Login = "login",
  Signup = "signup",

  Logout = "logout",

  Token = "token",
}

export enum ApiError {
  AuthFail = "auth_fail",

  LoginFail = "login_fail",
  SignupFail = "signup_fail",

  LogoutFail = "logout_fail",

  TokenFail = "token_fail",
}

export interface ApiReqSchema<T> {
  type: ApiCode;
  data: T;
}

export interface ApiResSchema<T> {
  data?: T;
  err?: ApiError;
}

export interface ApiReq {
  [ApiCode.Auth]: { token: string }

  [ApiCode.Login]: { email: string, password: string }
  [ApiCode.Signup]: { email: string, password: string }

  [ApiCode.Logout]: { token: string }

  [ApiCode.Token]: {
    token: string;
    clientId: string,
    clientSecret: string
  }
}

export interface ApiRes {
  [ApiCode.Auth]: ApiResSchema<{ userId: number }>

  [ApiCode.Login]: ApiResSchema<{}>
  [ApiCode.Signup]: ApiResSchema<{}>

  [ApiCode.Logout]: ApiResSchema<{}>

  [ApiCode.Token]: ApiResSchema<{
    token: string
  }>
}