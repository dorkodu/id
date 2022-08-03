export enum ApiCode {
  Auth = "auth",

  Login = "login",
  Signup = "signup",

  GetAuthToken = "get_auth_token",
}

export enum ApiError {

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

  [ApiCode.GetAuthToken]: {
    redirectURI: string,
    clientId: string,
    clientSecret: string
  }
}

export interface ApiRes {
  [ApiCode.Auth]: ApiResSchema<{ userId: number }>

  [ApiCode.Login]: ApiResSchema<{}>
  [ApiCode.Signup]: ApiResSchema<{}>

  [ApiCode.GetAuthToken]: ApiResSchema<{
    token: string
  }>
}