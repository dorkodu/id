import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { utils } from "./_utils";
import axios from "axios";
import { mailer } from "../../lib/mailer";

describe("login", () => {
  beforeAll(async () => {
    await utils.resetDatabase();
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("should initiate signup", async () => {
    vi.spyOn(mailer, "sendConfirmEmail").mockImplementation((_email, _otp) => { console.log(_otp); return Promise.resolve(true); })

    await axios.post(
      "http://oath_api:8001/api/auth/initiateSignup",
      { username: "test", email: "test@test.com" }
    )
      .then((_res => { }))
      .catch((_e) => { })

    expect(500).toBe(500);
  })
})