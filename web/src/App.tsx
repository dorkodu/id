import { useRef, useState } from "react";

import api from "./api";

interface State {
  user: IUser | undefined;
  authorized: boolean;
}

interface IUser {
  username: string;
  email: string;
  joinedAt: number;
}

function App() {
  const [state, setState] = useState<State>({ user: undefined, authorized: false });
  const [loading, setLoading] = useState(false);

  const loginInfo = useRef<HTMLInputElement>(null);
  const loginPassword = useRef<HTMLInputElement>(null);

  const signupUsername = useRef<HTMLInputElement>(null);
  const signupEmail = useRef<HTMLInputElement>(null);
  const signupPassword = useRef<HTMLInputElement>(null);

  const login = async () => {
    const info = loginInfo.current?.value;
    const password = loginPassword.current?.value;
    if (!info || !password) return;

    const { data: data0, err: err0 } = await api.login(info, password);
    if (err0 || !data0) return;

    setState({ ...state, authorized: true });

    const { data: data1, err: err1 } = await api.getUser();
    if (err1 || !data1) return;

    setState({ ...state, user: data1 });
  }

  const signup = async () => {
    const username = signupUsername.current?.value;
    const email = signupEmail.current?.value;
    const password = signupPassword.current?.value;
    if (!username || !email || !password) return;

    const { data: data0, err: err0 } = await api.signup(username, email, password);
    if (err0 || !data0) return;

    setState({ ...state, authorized: true });

    const { data: data1, err: err1 } = await api.getUser();
    if (err1 || !data1) return;

    setState({ ...state, user: data1 });
  }

  const logout = async () => {
    const { data, err } = await api.logout();
    if (err || !data) return;

    setState({ user: undefined, authorized: false });
  }

  return (
    <>
      {loading &&
        <>loading...</>
      }
      {!loading && !state.authorized &&
        <>
          <div><input ref={loginInfo} type={"text"} placeholder={"username or email..."} /></div>
          <div><input ref={loginPassword} type={"password"} placeholder={"password..."} /></div>
          <button onClick={login}>login</button>
          <br /><br />
          <div><input ref={signupUsername} type={"text"} placeholder={"username..."} /></div>
          <div><input ref={signupEmail} type={"email"} placeholder={"email..."} /></div>
          <div><input ref={signupPassword} type={"password"} placeholder={"password..."} /></div>
          <button onClick={signup}>signup</button>
        </>
      }
      {!loading && state.user &&
        <>
          <div>username: {state.user.username}</div>
          <div>email: {state.user.email}</div>
          <div>joined at: {new Date(state.user.joinedAt * 1000).toString()}</div>
          <br />

          <div>
            change username:
            <div><input type={"text"} placeholder={"new username..."} /></div>
            <button>apply</button>
          </div>
          <br />

          <div>
            change email:
            <div><input type={"text"} placeholder={"new email..."} /></div>
            <div><input type={"password"} placeholder={"password..."} /></div>
            <button>apply</button>
          </div>
          <br />

          <div>
            change password:
            <div><input type={"password"} placeholder={"old password..."} /></div>
            <div><input type={"password"} placeholder={"new username..."} /></div>
            <button>apply</button>
          </div>
          <br />

          <button onClick={logout}>logout</button>
        </>
      }
    </>
  )
}

export default App
