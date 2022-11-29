import axios, { AxiosResponse } from "axios"
import pg from "../../pg"
import cookie from "cookie"
import { ApiRoutes, apiRoutes } from "../../../../shared/src/api_routes"
import { expect } from "vitest"
import { ApiDetails } from "../../../../shared/src/api_details"

async function resetDatabase() {
  await pg.begin(pg => [
    pg`TRUNCATE TABLE users`,
    pg`TRUNCATE TABLE sessions`,
    pg`TRUNCATE TABLE email_token`,
    pg`TRUNCATE TABLE email_otp`,
  ])
}

async function request<T extends keyof ApiRoutes>(route: T, data?: ApiDetails[T]["input"], cookies?: any): Promise<AxiosResponse> {
  return new Promise((resolve) => {
    axios.post(`http://id_api:8001${apiRoutes[route]}`, data, { headers: { Cookie: cookies } })
      .then((res) => { resolve(res) })
      .catch((err) => { resolve(err.response) })
  });
}

function getCookies(res: AxiosResponse) {
  const cookies = res.headers["set-cookie"];
  if (!cookies) return undefined;
  return cookie.parse(cookies.join(";"));
}

function getCookieToken(res: AxiosResponse) {
  const cookies = getCookies(res);
  if (!cookies || !cookies["token"]) throw new Error();
  return cookies["token"];
}

async function signup(username: string, email: string, password: string) {
  await initiateSignup(username, email);

  const [result0]: [{ otp: number }?] = await pg`
    SELECT otp FROM email_otp WHERE username=${username} AND email=${email}
  `;
  if (!result0) throw "Initiate signup error.";

  expect(result0.otp).toBeTypeOf("number");
  expect(result0.otp).toBeGreaterThanOrEqual(100_000);
  expect(result0.otp).toBeLessThan(1_000_000);

  const res = await confirmSignup(username, email, password, result0.otp);

  const [result1]: [{ id: number }?] = await pg`
    SELECT id FROM users WHERE username=${username} AND email=${email}
  `;
  if (!result1) throw "Confirm signup error.";

  expect(result1.id).toBeTypeOf("number");
  return utils.getCookieToken(res);
}

async function initiateSignup(username: string, email: string) {
  return await utils.request("initiateSignup", { username, email })
}

async function confirmSignup(username: string, email: string, password: string, otp: number) {
  return await utils.request("confirmSignup", { username, email, password, otp: otp.toString() });
}

async function login(info: string, password: string) {
  const res = await utils.request("login", { info, password });
  const token = utils.getCookieToken(res);

  expect(token).toBeTypeOf("string");
  return token;
}

const username = "test";
const email = "test@test.com";
const password = "12345678";

export const utils = {
  resetDatabase,
  request,
  getCookies,
  getCookieToken,

  signup,
  initiateSignup,
  confirmSignup,
  login,

  username,
  email,
  password,
}