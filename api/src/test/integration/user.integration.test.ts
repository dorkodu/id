import axios from "axios";

describe("test", () => {
  test("blah blah blah", async () => {
    await axios.post("http://oath_api:8001/api/auth/auth")
      .then(res => { console.log(res) })
      .catch(err => { console.log(err) })
    expect(500).toBe(500);
  })
})