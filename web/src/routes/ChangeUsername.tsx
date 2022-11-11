import { useRef, useState } from "react"
import { useUserStore } from "../stores/userStore";

function ChangeUsername() {
  const [done, setDone] = useState(false);
  const queryChangeUsername = useUserStore(state => state.queryChangeUsername);

  const changeUsernameUsername = useRef<HTMLInputElement>(null);

  const changeUsername = async () => {
    const username = changeUsernameUsername.current?.value;
    if (!username) return;
    if (!await queryChangeUsername(username)) return;
    setDone(true);
  }

  return (
    <>
      <input ref={changeUsernameUsername} type={"text"} placeholder={"new username..."} />
      <br />
      <button onClick={changeUsername}>change username</button>
      <br />
      {done && <div>username is changed.</div>}
    </>
  )
}

export default ChangeUsername