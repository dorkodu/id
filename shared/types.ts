export enum ApiCode {
  Auth = "auth",

  Login = "login",
  Signup = "signup",

  Token = "token",
}

export enum ApiError {
  AuthFail,
  LoginFail,
  SignupFail,
  TokenFail,
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

  [ApiCode.Token]: {
    code: string;
    clientId: string,
    clientSecret: string
  }
}

export interface ApiRes {
  [ApiCode.Auth]: ApiResSchema<{ userId: number }>

  [ApiCode.Login]: ApiResSchema<{}>
  [ApiCode.Signup]: ApiResSchema<{}>

  [ApiCode.Token]: ApiResSchema<{
    token: string
  }>
}