import axios, { AxiosResponse } from "axios"
import pg from "../../pg"
import cookie from "cookie"
import { ApiRoutes, apiRoutes } from "../../../../shared/src/api_routes"

async function resetDatabase() {
  await pg.begin(pg => [
    pg`TRUNCATE TABLE users`,
    pg`TRUNCATE TABLE sessions`,
    pg`TRUNCATE TABLE email_token`,
    pg`TRUNCATE TABLE email_otp`,
  ])
}

async function request(route: keyof ApiRoutes, data?: any, cookies?: any): Promise<AxiosResponse> {
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

export const utils = {
  resetDatabase,
  request,
  getCookies,
  getCookieToken,
}