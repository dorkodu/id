import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import pg from "../../pg"
import cookie from "cookie"

async function resetDatabase() {
  await pg.begin(pg => [
    pg`TRUNCATE TABLE users`,
    pg`TRUNCATE TABLE sessions`,
    pg`TRUNCATE TABLE email_verification`,
    pg`TRUNCATE TABLE security_verification`,
    pg`TRUNCATE TABLE security_notification`,
  ])
}

async function request(url: string, data?: any, config?: AxiosRequestConfig) {
  return await axios.post(url, data, config);
}

function getCookies(res: AxiosResponse) {
  const cookies = res.headers["set-cookie"];
  if (!cookies) return undefined;
  return cookie.parse(cookies.join(";"));
}

export const utils = {
  resetDatabase,
  request,
  getCookies,
}