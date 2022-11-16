import { useLayoutEffect, useRef, useState } from "react";
import { useUserStore } from "../stores/userStore";

function ChangePassword() {
  const [done, setDone] = useState(false);
  const user = useUserStore(state => state.user);
  const queryInitiatePasswordChange = useUserStore(state => state.queryInitiatePasswordChange);

  const changePasswordUsername = useRef<HTMLInputElement>(null);
  const changePasswordEmail = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (!user) return;
    changePasswordUsername.current && (changePasswordUsername.current.value = user.username);
    changePasswordEmail.current && (changePasswordEmail.current.value = user.email);
  }, []);

  const initiateChangePassword = async () => {
    const username = changePasswordUsername.current?.value;
    const email = changePasswordEmail.current?.value;
    if (!username || !email) return;
    if (!await queryInitiatePasswordChange(username, email)) return;
    setDone(true);
  }

  return (
    <>
      <>
        <input ref={changePasswordUsername} type={"text"} placeholder={"username..."} />
        <br />
        <input ref={changePasswordEmail} type={"email"} placeholder={"email..."} />
        <br />
        <button onClick={initiateChangePassword}>initiate password change</button>
        <br />
        {done && <div>mail is sent. please check your email.</div>}
      </>
    </>
  )
}

export default ChangePassword