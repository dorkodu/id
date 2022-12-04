import { beforeEach, describe, expect, it } from "vitest";
import { utils } from "./_utils";

describe("external", () => {
  beforeEach(async () => {
    await utils.resetDatabase();
  })

  it("", async () => {
    expect(1).toBe(1);
  })
})