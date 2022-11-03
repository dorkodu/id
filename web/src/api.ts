import type { ApiDetail, ApiRoutes } from "../../api/src/types/api";

const routes: ApiRoutes = {
  auth: "/api/auth/auth",
  signup: "/api/auth/signup",
  login: "/api/auth/login",
  logout: "/api/auth/logout",

  getUser: "/api/user/getUser",
  changeUsername: "/api/user/changeUsername",
  changeEmail: "/api/user/changeEmail",
  changePassword: "/api/user/changePassword",

  getCurrentSession: "/api/session/getCurrentSession",
  getSessions: "/api/session/getSessions",
  terminateSession: "/api/session/terminateSession",
}

async function request<T extends keyof ApiRoutes>(url: T, data: ApiDetail[T]["input"]): Promise<{ data: ApiDetail[T]["output"] | undefined, err: boolean }> {
  const options: RequestInit = { method: "POST" }
  if (data !== undefined) {
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify(data)
  }

  try {
    const res = await fetch(routes[url], options);
    const out = { data: await res.json(), err: !res.ok };

    console.log(out);

    return out;
  } catch {
    return { data: undefined, err: true }
  }
}

async function auth() {
  return await request("auth", {});
}

async function signup(username: string, email: string, password: string) {
  return await request("signup", { username, email, password });
}

async function login(info: string, password: string) {
  return await request("login", { info, password });
}

async function logout() {
  return await request("logout", {});
}

async function getUser() {
  return await request("getUser", {});
}

async function changeUsername(newUsername: string) {
  return await request("changeUsername", { newUsername });
}

async function changeEmail(newEmail: string, password: string) {
  return await request("changeEmail", { newEmail, password });
}

async function changePassword(oldPassword: string, newPassword: string) {
  return await request("changePassword", { oldPassword, newPassword });
}

async function getCurrentSession() {
  return await request("getCurrentSession", {});
}

async function getSessions(anchor: number, type: "newer" | "older") {
  return await request("getSessions", { anchor, type });
}

async function terminateSession(sessionId: number) {
  return await request("terminateSession", { sessionId });
}

export default {
  auth,
  signup,
  login,
  logout,

  getUser,
  changeUsername,
  changeEmail,
  changePassword,

  getCurrentSession,
  getSessions,
  terminateSession,
}