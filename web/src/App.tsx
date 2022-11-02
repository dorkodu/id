import { useEffect, useRef, useState } from "react";

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
  const [loading, setLoading] = useState(true);

  const loginInfo = useRef<HTMLInputElement>(null);
  const loginPassword = useRef<HTMLInputElement>(null);

  const signupUsername = useRef<HTMLInputElement>(null);
  const signupEmail = useRef<HTMLInputElement>(null);
  const signupPassword = useRef<HTMLInputElement>(null);

  const changeUsernameNewUsername = useRef<HTMLInputElement>(null);

  const changeEmailNewEmail = useRef<HTMLInputElement>(null);
  const changeEmailPassword = useRef<HTMLInputElement>(null);

  const changePasswordOldPassword = useRef<HTMLInputElement>(null);
  const changePasswordNewPassword = useRef<HTMLInputElement>(null);

  useEffect(() => { auth() }, [])

  const auth = async () => {
    const { data: data0, err: err0 } = await api.auth();
    if (err0 || !data0) return setLoading(false);

    const { data: data1, err: err1 } = await api.getUser();
    if (err1 || !data1) return setLoading(false);

    setState({ user: data1, authorized: true });
    setLoading(false);
  }

  const login = async () => {
    const info = loginInfo.current?.value;
    const password = loginPassword.current?.value;
    if (!info || !password) return;

    setLoading(true);

    const { data: data0, err: err0 } = await api.login(info, password);
    if (err0 || !data0) return setLoading(false);

    const { data: data1, err: err1 } = await api.getUser();
    if (err1 || !data1) return setLoading(false);

    setState({ user: data1, authorized: true });
    setLoading(false);
  }

  const signup = async () => {
    const username = signupUsername.current?.value;
    const email = signupEmail.current?.value;
    const password = signupPassword.current?.value;
    if (!username || !email || !password) return;

    setLoading(true);

    const { data: data0, err: err0 } = await api.signup(username, email, password);
    if (err0 || !data0) return setLoading(false);

    const { data: data1, err: err1 } = await api.getUser();
    if (err1 || !data1) return setLoading(false);

    setState({ ...state, user: data1 });
    setLoading(false);
  }

  const logout = async () => {
    setLoading(true);

    const { data, err } = await api.logout();
    if (err || !data) return setLoading(false);

    setState({ user: undefined, authorized: false });
    setLoading(false);
  }

  const changeUsername = async () => {
    if (!state.user || !state.authorized) return;

    const newUsername = changeUsernameNewUsername.current?.value;
    if (!newUsername) return;

    setLoading(true);

    const { data, err } = await api.changeUsername(newUsername);
    if (err || !data) return setLoading(false);

    setState({ ...state, user: { ...state.user, username: newUsername } });
    setLoading(false);
  }

  const changeEmail = async () => {
    if (!state.user || !state.authorized) return;

    const newEmail = changeEmailNewEmail.current?.value;
    const password = changeEmailPassword.current?.value;
    if (!newEmail || !password) return;

    setLoading(true);

    const { data, err } = await api.changeEmail(newEmail, password);
    if (err || !data) return setLoading(false);

    setState({ ...state, user: { ...state.user, email: newEmail } });
    setLoading(false);
  }

  const changePassword = async () => {
    if (!state.user || !state.authorized) return;

    const oldPassword = changePasswordOldPassword.current?.value;
    const newPassword = changePasswordNewPassword.current?.value;
    if (!oldPassword || !newPassword) return;

    setLoading(true);

    const { data, err } = await api.changePassword(oldPassword, newPassword);
    if (err || !data) return setLoading(false);

    setLoading(false);
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
            <div><input ref={changeUsernameNewUsername} type={"text"} placeholder={"new username..."} /></div>
            <button onClick={changeUsername}>apply</button>
          </div>
          <br />

          <div>
            change email:
            <div><input ref={changeEmailNewEmail} type={"text"} placeholder={"new email..."} /></div>
            <div><input ref={changeEmailPassword} type={"password"} placeholder={"password..."} /></div>
            <button onClick={changeEmail}>apply</button>
          </div>
          <br />

          <div>
            change password:
            <div><input ref={changePasswordOldPassword} type={"password"} placeholder={"old password..."} /></div>
            <div><input ref={changePasswordNewPassword} type={"password"} placeholder={"new password..."} /></div>
            <button onClick={changePassword}>apply</button>
          </div>
          <br />

          <button onClick={logout}>logout</button>
        </>
      }
    </>
  )
}

export default App
