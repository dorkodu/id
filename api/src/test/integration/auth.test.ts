import { beforeEach, describe, expect, it } from "vitest";
import { utils } from "./_utils";
import pg from "../../pg";
import cookie from "cookie"
import { date } from "../../lib/date";

describe("auth", () => {
  beforeEach(async () => {
    await utils.resetDatabase();
  })

  it("should signup", async () => {
    const { username, email, password } = utils;
    const token = await utils.signup(username, email, password);

    expect(token).toBeTypeOf("string");
  })

  it("should login with username", async () => {
    const { username, email, password } = utils;
    await utils.signup(username, email, password);
    const token = await utils.login(username, password);

    expect(token).toBeTypeOf("string");
  })

  it("should login with email", async () => {
    const { username, email, password } = utils;
    await utils.signup(username, email, password);
    const token = await utils.login(email, password);

    expect(token).toBeTypeOf("string");
  })

  it("should auth after login with username/email", async () => {
    const { username, email, password } = utils;
    await utils.signup(username, email, password);

    // Login & auth using username
    const token0 = await utils.login(username, password);
    const cookies0 = cookie.serialize("token", token0);
    const res0 = await utils.request("auth", {}, cookies0);
    expect(res0.status).toBe(200);

    // Login & auth using email
    const token1 = await utils.login(email, password);
    const cookies1 = cookie.serialize("token", token1);
    const res1 = await utils.request("auth", {}, cookies1);
    expect(res1.status).toBe(200);
  })

  it("logout should work", async () => {
    const { username, email, password } = utils;
    await utils.signup(username, email, password);

    const token = await utils.login(username, password);
    expect(token).toBeTypeOf("string");

    const cookies = cookie.serialize("token", token);
    const res0 = await utils.request("logout", {}, cookies);
    expect(res0.status).toBe(200);

    const res1 = await utils.request("auth", {}, cookies);
    expect(res1.status).toBe(500);
  })

  it("should not signup with already used username/email", async () => {
    const { username, email, password } = utils;
    await utils.signup(username, email, password);

    const unusedUsername = "unused";
    const unusedEmail = "unused@unused.com";

    // Use un-used username & used email
    const res0 = await utils.request("initiateSignup", { username: unusedUsername, email })
    expect(res0.status).toBe(500);

    // Use un-used email & used username
    const res1 = await utils.request("initiateSignup", { username, email: unusedEmail })
    expect(res1.status).toBe(500);
  })

  it("should re-initiate signup if current has expired", async () => {
    const { username, email } = utils;
    await utils.initiateSignup(username, email);

    const res0 = await utils.initiateSignup(username, email);
    expect(res0.status).toBe(500);

    await pg`
      UPDATE email_otp SET expires_at=${date.utc()} 
      WHERE username=${username} AND email=${email}
    `;

    const res1 = await utils.initiateSignup(username, email);
    expect(res1.status).toBe(200);
  })

  it("should re-initiate signup if current has no tries left", async () => {
    const { username, email } = utils;
    await utils.initiateSignup(username, email);

    const res0 = await utils.initiateSignup(username, email);
    expect(res0.status).toBe(500);

    await pg`
      UPDATE email_otp SET tries_left=0 
      WHERE username=${username} AND email=${email}
    `;

    const res1 = await utils.initiateSignup(username, email);
    expect(res1.status).toBe(200);
  })
})