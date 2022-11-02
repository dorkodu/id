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

interface ISession {
  id: number;
  createdAt: number;
  expiresAt: number;
  userAgent: string;
  ip: string;
}

function App() {
  const [state, setState] = useState<State>({ user: undefined, authorized: false });
  const [sessions, setSessions] = useState<ISession[]>([]);
  const [currentSession, setCurrentSession] = useState<ISession | undefined>(undefined);

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
  useEffect(() => { getCurrentSession(); getSessions(); }, [state.authorized])

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
    setCurrentSession(undefined);
    setSessions([]);
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

  const getCurrentSession = async () => {
    if (!state.user || !state.authorized) return;

    const { data, err } = await api.getCurrentSession();
    if (err || !data) return;

    setCurrentSession(data);
  }

  const getSessions = async () => {
    if (!state.user || !state.authorized) return;

    const anchor = !sessions.length ? -1 : sessions[sessions.length - 1]?.id;
    if (anchor === undefined) return;

    const { data, err } = await api.getSessions(anchor);
    if (err || !data) return;

    setSessions([...sessions, ...data]);
  }

  const terminateSession = async (sessionId: number) => {
    if (!state.user || !state.authorized) return;

    const { data, err } = await api.terminateSession(sessionId);
    if (err || !data) return;

    if (currentSession && currentSession.id === sessionId) {
      setState({ user: undefined, authorized: false });
      setCurrentSession(undefined);
      setSessions([]);
    }
    else {
      setSessions(sessions.filter((session) => session.id !== sessionId));
    }
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

          <div>
            <div>current session:</div>
            <br />
            {currentSession &&
              <>
                <div>created at: {new Date(currentSession.createdAt * 1000).toString()}</div>
                <div>expires at: {new Date(currentSession.expiresAt * 1000).toString()}</div>
                <div>ip: {currentSession.ip}</div>
                <div>user agent: {currentSession.userAgent}</div>
                <button onClick={() => { terminateSession(currentSession.id) }}>terminate session</button>
              </>
            }
            <br /><br />
          </div>

          <div>
            <div>all sessions:</div>
            {
              sessions.map((session) => currentSession && currentSession.id !== session.id &&
                <div key={session.id}>
                  <br />
                  <div>created at: {new Date(session.createdAt * 1000).toString()}</div>
                  <div>expires at: {new Date(session.expiresAt * 1000).toString()}</div>
                  <div>ip: {session.ip}</div>
                  <div>user agent: {session.userAgent}</div>
                  <button onClick={() => { terminateSession(session.id) }}>terminate session</button>
                </div>
              )
            }
          </div>
          <br />

          <button onClick={logout}>logout</button>
        </>
      }
    </>
  )
}

export default App
