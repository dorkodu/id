import { beforeAll, describe, expect, it } from "vitest";
import { utils } from "./_utils";
import pg from "../../pg";

describe("login", () => {
  beforeAll(async () => {
    await utils.resetDatabase();
  })

  it("should signup", async () => {
    const username = "test";
    const email = "test@test.com";
    const password = "12345678";

    await utils.request("http://oath_api:8001/api/auth/initiateSignup", { username, email })

    const [result0]: [{ otp: number }?] = await pg`
      SELECT otp FROM email_verification WHERE username=${username} AND email=${email}
    `;
    if (!result0) throw new Error();

    expect(result0.otp).toBeTypeOf("number");
    expect(result0.otp).toBeGreaterThanOrEqual(100_000);
    expect(result0.otp).toBeLessThan(1_000_000);

    await utils.request("http://oath_api:8001/api/auth/confirmSignup",
      { username, email, password, otp: result0.otp.toString() });

    const [result1]: [{ id: number }?] = await pg`
      SELECT id FROM users WHERE username=${username} AND email=${email}
    `;
    if (!result1) throw new Error();

    expect(result1.id).toBeTypeOf("number");
  })

  it("should login with username", async () => {
    const info = "test";
    const password = "12345678";

    const res = await utils.request("http://oath_api:8001/api/auth/login", { info, password });
    const cookies = utils.getCookies(res);
    if (!cookies) throw new Error();
    const token = cookies["token"];
    if (!token) throw new Error();

    expect(token).toBeTypeOf("string");
  })

  it("should login with email", async () => {
    const info = "test@test.com";
    const password = "12345678";

    const res = await utils.request("http://oath_api:8001/api/auth/login", { info, password });
    const cookies = utils.getCookies(res);
    if (!cookies) throw new Error();
    const token = cookies["token"];
    if (!token) throw new Error();

    expect(token).toBeTypeOf("string");
  })
})