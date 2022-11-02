async function request<TData>(url: string, data?: any): Promise<{ data: TData | undefined, err: boolean }> {
  const options: RequestInit = { method: "POST" }
  if (data !== undefined) {
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify(data)
  }

  try {
    const res = await fetch(url, options);
    const out = { data: await res.json(), err: !res.ok };

    console.log(out);

    return out;
  } catch {
    return { data: undefined, err: true }
  }
}

async function auth() {
  return await request<{}>("/api/auth/auth");
}

async function signup(username: string, email: string, password: string) {
  return await request<{}>("/api/auth/signup", { username, email, password });
}

async function login(info: string, password: string) {
  return await request<{}>("/api/auth/login", { info, password });
}

async function logout() {
  return await request<{}>("/api/auth/logout");
}

async function getUser() {
  return await request<{ username: string, email: string, joinedAt: number }>("/api/user/getUser");
}

async function changeUsername(newUsername: string) {
  return await request<{}>("/api/user/changeUsername", { newUsername });
}

async function changeEmail(newEmail: string, password: string) {
  return await request<{}>("/api/user/changeEmail", { newEmail, password });
}

async function changePassword(oldPassword: string, newPassword: string) {
  return await request<{}>("/api/user/changePassword", { oldPassword, newPassword });
}

async function getSessions(anchor: number) {
  return await request<{
    id: number,
    createdAt: number,
    expiresAt: number,
    userAgent: string,
    ip: string
  }[]>("/api/user/getSessions", { anchor });
}

async function terminateSession(sessionId: number) {
  return await request<{}>("/api/user/terminateSession", { sessionId });
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

  getSessions,
  terminateSession,
}