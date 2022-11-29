import { beforeEach, describe, expect, it } from "vitest";
import { utils } from "./_utils";
import cookie from "cookie"
import pg from "../../pg";

describe("session", () => {
  beforeEach(async () => {
    await utils.resetDatabase();
  })

  it("should get current session", async () => {
    const { username, email, password } = utils;
    const token = await utils.signup(username, email, password);

    const cookies = cookie.serialize("token", token);
    const res = await utils.request("getCurrentSession", {}, cookies);

    expect(res.status).toBe(200);
  })

  it("should get sessions", async () => {
    const { username, email, password } = utils;
    const token = await utils.signup(username, email, password);
    const cookies = cookie.serialize("token", token);

    // Login 5 times
    for (let i = 0; i < 5; ++i) await utils.login(username, password);

    const res = await utils.request("getSessions", { anchor: -1, type: "newer" }, cookies);
    expect(res.status).toBe(200);
    expect(res.data.length).toBe(6);
  })

  it("should terminate session current session", async () => {
    const { username, email, password } = utils;
    const token = await utils.signup(username, email, password);
    const cookies = cookie.serialize("token", token);

    const [result0]: [{ id: number }?] = await pg`
      SELECT id FROM users WHERE username=${username} AND email=${email}
    `;
    if (!result0) throw "Could not find user id."

    const [result1]: [{ id: number }?] = await pg`
      SELECT id FROM sessions WHERE user_id=${result0.id}
    `;
    if (!result1) throw "Could not find session id."

    const res0 = await utils.request("getCurrentSession", {}, cookies);
    expect(res0.status).toBe(200);

    const res1 = await utils.request("terminateSession", { sessionId: result1.id }, cookies);
    expect(res1.status).toBe(200);

    const res2 = await utils.request("getCurrentSession", {}, cookies);
    expect(res2.status).toBe(500);
  })
})