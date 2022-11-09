import type { ApiDetail, ApiRoutes } from "../../api/src/types/api";
import { apiRoutes } from "./types";

async function request<T extends keyof ApiRoutes>(url: T, data: ApiDetail[T]["input"]): Promise<{ data: ApiDetail[T]["output"] | undefined, err: boolean }> {
  const options: RequestInit = { method: "POST" }
  if (data !== undefined) {
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify(data)
  }

  try {
    const res = await fetch(apiRoutes[url], options);
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

async function initiateSignup(username: string, email: string) {
  return await request("initiateSignup", { username, email });
}

async function confirmSignup(username: string, email: string, password: string, otp: string) {
  return await request("confirmSignup", { username, email, password, otp });
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

async function initiateEmailChange(newEmail: string) {
  return await request("initiateEmailChange", { newEmail });
}

async function confirmEmailChange(token: string) {
  return await request("confirmEmailChange", { token });
}

async function revertEmailChange(token: string) {
  return await request("revertEmailChange", { token });
}

async function initiatePasswordChange(username: string, email: string) {
  return await request("initiatePasswordChange", { username, email });
}

async function confirmPasswordChange(newPassword: string, token: string) {
  return await request("confirmPasswordChange", { newPassword, token });
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

async function getAccesses() {
  return await request("getAccesses", {});
}

async function checkAccess() {
  return await request("checkAccess", {});
}

async function grantAccess() {
  return await request("grantAccess", {});
}

async function revokeAccess() {
  return await request("revokeAccess", {});
}

export default {
  auth,
  initiateSignup,
  confirmSignup,
  login,
  logout,

  getUser,
  changeUsername,
  initiateEmailChange,
  confirmEmailChange,
  revertEmailChange,
  initiatePasswordChange,
  confirmPasswordChange,

  getCurrentSession,
  getSessions,
  terminateSession,

  getAccesses,
  checkAccess,
  grantAccess,
  revokeAccess,
}