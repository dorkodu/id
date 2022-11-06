import { useEffect, useRef, useState } from "react";

import api from "./api";

import type { IUser } from "../../api/src/types/user";
import type { ISession } from "../../api/src/types/session";
import { useNavigate, useSearchParams } from "react-router-dom";
import { emailTypes } from "./types";

interface State {
  user: IUser | undefined;
  authorized: boolean;
}

function App() {
  const [state, setState] = useState<State>({ user: undefined, authorized: false });
  const [sessions, setSessions] = useState<{ ids: number[], entities: Record<number, ISession> }>({ ids: [], entities: {} });
  const [currentSession, setCurrentSession] = useState<ISession | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const loginInfo = useRef<HTMLInputElement>(null);
  const loginPassword = useRef<HTMLInputElement>(null);

  const signupUsername = useRef<HTMLInputElement>(null);
  const signupEmail = useRef<HTMLInputElement>(null);
  const signupPassword = useRef<HTMLInputElement>(null);

  const changeUsernameNewUsername = useRef<HTMLInputElement>(null);

  const changeEmailNewEmail = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const type = searchParams.get("type");
    if (!type) auth();
    else if (type === emailTypes.confirmEmailChange) confirmEmailChange();
    else if (type === emailTypes.revertEmailChange) revertEmailChange();
    else if (type === emailTypes.confirmPasswordChange) confirmPasswordChange();
    else { navigate("/"); auth(); };
  }, [])
  useEffect(() => { getCurrentSession(); getSessions("newer", true); }, [state.authorized])

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
    setSessions({ ids: [], entities: {} });
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

  const initiateEmailChange = async () => {
    if (!state.user || !state.authorized) return;

    const newEmail = changeEmailNewEmail.current?.value;
    if (!newEmail) return;

    const { data, err } = await api.initiateEmailChange(newEmail);
    if (err || !data) return;

    console.log("initiateEmailChange");
  }

  const confirmEmailChange = async () => {
    const token = searchParams.get("token");
    if (!token) { navigate("/"); auth(); return; };

    const { data, err } = await api.confirmEmailChange(token);
    if (err || !data) { navigate("/"); auth(); return; };
    
    setLoading(false);
  }

  const revertEmailChange = async () => {
    const token = searchParams.get("token");
    if (!token) { navigate("/"); auth(); return; };

    const { data, err } = await api.revertEmailChange(token);
    if (err || !data) { navigate("/"); auth(); return; };

    setLoading(false);
  }

  const initiatePasswordChange = async () => {
    if (!state.user || !state.authorized) return;
  }

  const confirmPasswordChange = async () => {

  }

  const forgotPassword = async () => {

  }

  const getCurrentSession = async () => {
    if (!state.user || !state.authorized) return;

    const { data, err } = await api.getCurrentSession();
    if (err || !data) return;

    setCurrentSession(data);
  }

  const getSessions = async (type: "newer" | "older", refresh?: boolean) => {
    if (!state.user || !state.authorized) return;

    const anchor = getAnchor(sessions.ids, type, refresh);

    const { data, err } = await api.getSessions(anchor, type);
    if (err || !data) return;

    if (refresh) sessions.ids = [];

    const ids = sortArray([...sessions.ids, ...data.map((session) => session.id)]);
    const entities = sessions.entities;
    data.forEach((session) => void (entities[session.id] = session));

    setSessions({ ids, entities });
  }

  const terminateSession = async (sessionId: number) => {
    if (!state.user || !state.authorized) return;

    const { data, err } = await api.terminateSession(sessionId);
    if (err || !data) return;

    if (currentSession && currentSession.id === sessionId) {
      setState({ user: undefined, authorized: false });
      setCurrentSession(undefined);
      setSessions({ ids: [], entities: {} });
    }
    else {
      const ids = sessions.ids.filter((id) => id !== sessionId)
      const entities = sessions.entities;
      if (entities[sessionId]) delete entities[sessionId];

      setSessions({ ids, entities });
    }
  }

  /// HELPER FUNCTIONS \\\
  const getAnchor = (arr: number[], type: "newer" | "older", refresh?: boolean): number => {
    if (!arr.length || refresh) return -1;
    const out = type === "newer" ? arr[0] : arr[arr.length - 1];
    return out === undefined ? -1 : out;
  }

  const sortArray = (arr: number[]) => {
    return [... new Set(arr)].sort((a, b) => (b - a));
  }
  /// HELPER FUNCTIONS \\\

  return (
    <>
      {loading && searchParams.get("type") === emailTypes.confirmEmailChange &&
        <>confirming email...</>
      }
      {!loading && searchParams.get("type") === emailTypes.confirmEmailChange &&
        <>confirmed email. you can close this tab.</>
      }
      {loading && searchParams.get("type") === emailTypes.revertEmailChange &&
        <>reverting email...</>
      }
      {!loading && searchParams.get("type") === emailTypes.revertEmailChange &&
        <>reverted email. you can close this tab.</>
      }
      {loading && searchParams.get("type") === emailTypes.confirmPasswordChange &&
        <>confirming password...</>
      }
      {!loading && searchParams.get("type") === emailTypes.confirmPasswordChange &&
        <>confirmed password. you can close this tab.</>
      }
      {loading && !searchParams.get("type") &&
        <>loading...</>
      }
      {!loading && !state.authorized &&
        <>
          <div><input ref={loginInfo} type={"text"} placeholder={"username or email..."} /></div>
          <div><input ref={loginPassword} type={"password"} placeholder={"password..."} /></div>
          <button onClick={login}>login</button>
          <button onClick={forgotPassword}>forgot password</button>
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
            <button onClick={initiateEmailChange}>apply</button>
          </div>
          <br />

          <div>
            change password:<br />
            <button onClick={initiatePasswordChange}>apply</button>
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
            <button onClick={() => { getSessions("newer") }}>load newer</button>
            <button onClick={() => { getSessions("older") }}>load older</button>
            <button onClick={() => { getSessions("newer", true) }}>refresh</button>
            {
              sessions.ids.map((id) => currentSession && currentSession.id !== id && sessions.entities[id] &&
                <div key={sessions.entities[id]!.id}>
                  <br />
                  <div>created at: {new Date(sessions.entities[id]!.createdAt * 1000).toString()}</div>
                  <div>expires at: {new Date(sessions.entities[id]!.expiresAt * 1000).toString()}</div>
                  <div>ip: {sessions.entities[id]!.ip}</div>
                  <div>user agent: {sessions.entities[id]!.userAgent}</div>
                  <button onClick={() => { terminateSession(sessions.entities[id]!.id) }}>terminate session</button>
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
