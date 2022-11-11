import { useLayoutEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useUserStore } from "../stores/userStore";

function ChangePassword() {
  const [searchParams] = useSearchParams();
  const [done, setDone] = useState(false);
  const user = useUserStore(state => state.user);
  const queryInitiatePasswordChange = useUserStore(state => state.queryInitiatePasswordChange);
  const queryConfirmPasswordChange = useUserStore(state => state.queryConfirmPasswordChange);

  const changePasswordUsername = useRef<HTMLInputElement>(null);
  const changePasswordEmail = useRef<HTMLInputElement>(null);
  const changePasswordPassword = useRef<HTMLInputElement>(null);
  const changePasswordOTP = useRef<HTMLInputElement>(null);

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

  const confirmChangePassword = async () => {
    const username = changePasswordUsername.current?.value;
    const email = changePasswordEmail.current?.value;
    const password = changePasswordPassword.current?.value;
    const otp = changePasswordOTP.current?.value;
    const token = searchParams.get("token");
    if (!username || !email || !password || !otp || !token) return;
    if (!await queryConfirmPasswordChange(password, otp)) return;
    setDone(true);
  }

  return (
    <>
      {!searchParams.get("token") &&
        <>
          <input ref={changePasswordUsername} type={"text"} placeholder={"username..."} />
          <br />
          <input ref={changePasswordEmail} type={"email"} placeholder={"email..."} />
          <br />
          <button onClick={initiateChangePassword}>initiate password change</button>
          <br />
          {done && <div>mail is sent. please check your email.</div>}
        </>
      }
      {searchParams.get("token") &&
        <>
          <input ref={changePasswordPassword} type={"text"} placeholder={"new password..."} />
          <br />
          <input ref={changePasswordOTP} type={"password"} placeholder={"otp..."} />
          <br />
          <button onClick={confirmChangePassword}>confirm password change</button>
          {done && <div>password is changed. please login.</div>}
        </>
      }
    </>
  )
}

export default ChangePassword