import { createClient } from "redis";

const keydb = createClient({ url: `redis://oath_keydb:6379` })
keydb.on("error", (err) => console.log(err))

export default keydb