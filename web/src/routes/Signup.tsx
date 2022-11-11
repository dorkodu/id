import { useLayoutEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/userStore";

function Signup() {
  const navigate = useNavigate();
  const queryInitiateSignup = useUserStore(state => state.queryInitiateSignup);
  const queryConfirmSignup = useUserStore(state => state.queryConfirmSignup);

  const [stage, setStage] = useState<"initiate" | "confirm">("initiate");
  const [info, setInfo] = useState({ username: "", email: "" });

  const signupUsername = useRef<HTMLInputElement>(null);
  const signupEmail = useRef<HTMLInputElement>(null);
  const signupPassword = useRef<HTMLInputElement>(null);
  const signupOTP = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    signupUsername.current && (signupUsername.current.value = info.username);
    signupEmail.current && (signupEmail.current.value = info.email);
  }, [stage])

  const initiateSignup = async () => {
    const username = signupUsername.current?.value;
    const email = signupEmail.current?.value;
    if (!username || !email) return;
    if (!await queryInitiateSignup(username, email)) return;
    setStage("confirm");
    setInfo({ username, email });
  }

  const confirmSignup = async () => {
    const username = signupUsername.current?.value;
    const email = signupEmail.current?.value;
    const password = signupPassword.current?.value;
    const otp = signupOTP.current?.value;
    if (!username || !email || !password || !otp) return;
    if (!await queryConfirmSignup(username, email, password, otp)) return;
    navigate("/dashboard");
  }

  return (
    <>
      {stage === "initiate" &&
        <>
          <input ref={signupUsername} type={"text"} placeholder={"username..."} />
          <br />
          <input ref={signupEmail} type={"email"} placeholder={"email..."} />
          <br />
          <button onClick={initiateSignup}>signup</button>
        </>
      }
      {stage === "confirm" &&
        <>
          <input ref={signupUsername} type={"text"} placeholder={"username..."} />
          <br />
          <input ref={signupEmail} type={"email"} placeholder={"email..."} />
          <br />
          <input ref={signupPassword} type={"password"} placeholder={"password..."} />
          <br />
          <input ref={signupOTP} type={"text"} placeholder={"otp..."} />
          <br />
          <button onClick={confirmSignup}>signup</button>
        </>
      }
    </>
  )
}

export default Signup