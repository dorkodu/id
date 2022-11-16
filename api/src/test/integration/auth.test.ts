import { beforeAll, describe, expect, it } from "vitest";
import { utils } from "./_utils";
import pg from "../../pg";
import cookie from "cookie"

async function signup(username: string, email: string, password: string) {
  await utils.request("http://oath_api:8001/api/auth/initiateSignup", { username, email })

  const [result0]: [{ otp: number }?] = await pg`
        SELECT otp FROM email_otp WHERE username=${username} AND email=${email}
      `;
  if (!result0) throw new Error();

  expect(result0.otp).toBeTypeOf("number");
  expect(result0.otp).toBeGreaterThanOrEqual(100_000);
  expect(result0.otp).toBeLessThan(1_000_000);

  const res = await utils.request("http://oath_api:8001/api/auth/confirmSignup",
    { username, email, password, otp: result0.otp.toString() });

  const [result1]: [{ id: number }?] = await pg`
        SELECT id FROM users WHERE username=${username} AND email=${email}
      `;
  if (!result1) throw new Error();

  expect(result1.id).toBeTypeOf("number");
  return utils.getCookieToken(res);
}

async function loginWithUsername(info: string, password: string) {
  const res = await utils.request("http://oath_api:8001/api/auth/login", { info, password });
  const token = utils.getCookieToken(res);

  expect(token).toBeTypeOf("string");
  return token;
}

async function loginWithEmail(info: string, password: string) {
  const res = await utils.request("http://oath_api:8001/api/auth/login", { info, password });
  const token = utils.getCookieToken(res);

  expect(token).toBeTypeOf("string");
  return token;
}

describe("login", () => {
  beforeAll(async () => {
    await utils.resetDatabase();
  })

  it("should signup", async () => {
    const username = "test";
    const email = "test@test.com";
    const password = "12345678";

    const token = await signup(username, email, password);

    expect(token).toBeTypeOf("string");
  })

  it("should login with username", async () => {
    const info = "test";
    const password = "12345678";

    const token = await loginWithUsername(info, password);

    expect(token).toBeTypeOf("string");
  })

  it("should login with email", async () => {
    const info = "test@test.com";
    const password = "12345678";

    const token = await loginWithEmail(info, password);

    expect(token).toBeTypeOf("string");
  })

  it("should auth after login with username", async () => {
    const info = "test";
    const password = "12345678";

    const token = await loginWithUsername(info, password);
    const cookies = cookie.serialize("token", token);
    const res = await utils.request("http://oath_api:8001/api/auth/auth", {}, cookies);

    expect(res.status).toBe(200);
  })

  it("should auth after login with email", async () => {
    const info = "test@test.com";
    const password = "12345678";

    const token = await loginWithEmail(info, password);
    const cookies = cookie.serialize("token", token);
    const res = await utils.request("http://oath_api:8001/api/auth/auth", {}, cookies);

    expect(res.status).toBe(200);
  })

  it("should not signup with already used username/email", async () => {
    const username = "test";
    const email = "test@test.com";
    const res = await utils.request("http://oath_api:8001/api/auth/initiateSignup", { username, email })

    expect(res.status).toBe(500);
  })

  it("logout should work", async () => {
    const info = "test";
    const password = "12345678";
    const token = await loginWithUsername(info, password);
    expect(token).toBeTypeOf("string");

    const cookies = cookie.serialize("token", token);
    const res0 = await utils.request("http://oath_api:8001/api/auth/logout", {}, cookies);
    expect(res0.status).toBe(200);

    const res1 = await utils.request("http://oath_api:8001/api/auth/auth", {}, cookies);
    expect(res1.status).toBe(500);
  })
})