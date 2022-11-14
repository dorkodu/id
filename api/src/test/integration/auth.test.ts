import { beforeAll, describe, expect, it } from "vitest";
import { utils } from "./_utils";
import axios from "axios";
import pg from "../../pg";

describe("login", () => {
  beforeAll(async () => {
    await utils.resetDatabase();
  })

  it("should signup", async () => {
    const username = "test";
    const email = "test@test.com";
    const password = "12345678";

    await axios.post(
      "http://oath_api:8001/api/auth/initiateSignup",
      { username, email }
    )
      .then((_res => { }))
      .catch((_e) => { })

    const [result0]: [{ otp: number }] = await pg`
      SELECT otp FROM email_verification WHERE username=${username} AND email=${email}
    `;
    expect(result0).toBeDefined();
    expect(result0.otp).toBeTypeOf("number");
    expect(result0.otp).toBeGreaterThanOrEqual(100_000);
    expect(result0.otp).toBeLessThan(1_000_000);

    await axios.post(
      "http://oath_api:8001/api/auth/confirmSignup",
      { username, email, password, otp: result0.otp.toString() }
    )
      .then((_res => { }))
      .catch((_e) => { })

    const [result1]: [{ id: number }] = await pg`
      SELECT id FROM users WHERE username=${username} AND email=${email}
    `;

    expect(result1).toBeDefined();
    expect(result1.id).toBeTypeOf("number");
  })
})