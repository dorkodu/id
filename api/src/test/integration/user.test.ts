import { beforeEach, describe, expect, it } from "vitest";
import { utils } from "./_utils";
import cookie from "cookie"

describe("user", () => {
  beforeEach(async () => {
    await utils.resetDatabase();
  })

  it("should get user", async () => {
    const { username, email, password } = utils;
    const token = await utils.signup(username, email, password);

    const cookies = cookie.serialize("token", token);
    const res = await utils.request("getUser", {}, cookies);

    expect(res.status).toBe(200);
    expect(res.data.username).toBe(username);
    expect(res.data.email).toBe(email);
  })

  it("should change username", async () => {
    const { username, email, password } = utils;
    const token = await utils.signup(username, email, password);

    const newUsername = "newusername";

    const cookies = cookie.serialize("token", token);
    const res0 = await utils.request("changeUsername", { newUsername }, cookies);
    expect(res0.status).toBe(200);

    const res1 = await utils.request("getUser", {}, cookies);
    expect(res1.status).toBe(200);
    expect(res1.data.username).toBe(newUsername);
  })
})