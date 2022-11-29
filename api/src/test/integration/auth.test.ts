import { beforeEach, describe, expect, it } from "vitest";
import { utils } from "./_utils";
import pg from "../../pg";
import cookie from "cookie"
import { date } from "../../lib/date";

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

describe("auth", () => {
  beforeEach(async () => {
    await utils.resetDatabase();
  })

  it("should signup", async () => {
    const token = await signup(username, email, password);

    expect(token).toBeTypeOf("string");
  })

  it("should login with username", async () => {
    await signup(username, email, password);
    const token = await login(username, password);

    expect(token).toBeTypeOf("string");
  })

  it("should login with email", async () => {
    await signup(username, email, password);
    const token = await login(email, password);

    expect(token).toBeTypeOf("string");
  })

  it("should auth after login with username/email", async () => {
    await signup(username, email, password);

    // Login & auth using username
    const token0 = await login(username, password);
    const cookies0 = cookie.serialize("token", token0);
    const res0 = await utils.request("auth", {}, cookies0);
    expect(res0.status).toBe(200);

    // Login & auth using email
    const token1 = await login(email, password);
    const cookies1 = cookie.serialize("token", token1);
    const res1 = await utils.request("auth", {}, cookies1);
    expect(res1.status).toBe(200);
  })

  it("logout should work", async () => {
    await signup(username, email, password);

    const token = await login(username, password);
    expect(token).toBeTypeOf("string");

    const cookies = cookie.serialize("token", token);
    const res0 = await utils.request("logout", {}, cookies);
    expect(res0.status).toBe(200);

    const res1 = await utils.request("auth", {}, cookies);
    expect(res1.status).toBe(500);
  })

  it("should not signup with already used username/email", async () => {
    await signup(username, email, password);

    const unusedUsername = "unused";
    const unusedEmail = "unused@unused.com";

    // Use un-used username & used email
    const res0 = await utils.request("initiateSignup", { unusedUsername, email })
    expect(res0.status).toBe(500);

    // Use un-used email & used username
    const res1 = await utils.request("initiateSignup", { username, unusedEmail })
    expect(res1.status).toBe(500);
  })

  it("should re-initiate signup if current has expired", async () => {
    await initiateSignup(username, email);

    const res0 = await initiateSignup(username, email);
    expect(res0.status).toBe(500);

    await pg`
      UPDATE email_otp SET expires_at=${date.old()} 
      WHERE username=${username} AND email=${email}
    `;

    const res1 = await initiateSignup(username, email);
    expect(res1.status).toBe(200);
  })

  it("should re-initiate signup if current has no tries left", async () => {
    await initiateSignup(username, email);

    const res0 = await initiateSignup(username, email);
    expect(res0.status).toBe(500);

    await pg`
      UPDATE email_otp SET tries_left=0 
      WHERE username=${username} AND email=${email}
    `;

    const res1 = await initiateSignup(username, email);
    expect(res1.status).toBe(200);
  })
})