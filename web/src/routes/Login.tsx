import { useRef } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserStore } from "../stores/userStore";

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryLogin = useUserStore(state => state.queryLogin);
  const loginInfo = useRef<HTMLInputElement>(null);
  const loginPassword = useRef<HTMLInputElement>(null);

  const login = async () => {
    const info = loginInfo.current?.value;
    const password = loginPassword.current?.value;
    if (!info || !password) return;
    if (!await queryLogin(info, password)) return;

    const redirect = searchParams.get("redirect");
    if (!redirect) navigate("/dashboard");
    else navigate(redirect);
  }

  return (
    <>
      <input ref={loginInfo} type={"text"} placeholder={"username or email..."} />
      <br />
      <input ref={loginPassword} type={"password"} placeholder={"password..."} />
      <br />
      <button onClick={login}>login</button>
    </>
  )
}

export default Login