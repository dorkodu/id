import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Session from "../components/Session";
import Access from "../components/Access";
import Spinner from "../components/Spinner";
import { date } from "../lib/date";
import { useUserStore } from "../stores/userStore"

function Dashboard() {
  const navigate = useNavigate();

  const queryGetUser = useUserStore(state => state.queryGetUser);
  const queryGetCurrentSession = useUserStore(state => state.queryGetCurrentSession);
  const queryGetSessions = useUserStore(state => state.queryGetSessions);
  const queryGetAccesses = useUserStore(state => state.queryGetAccesses);
  const queryLogout = useUserStore(state => state.queryLogout);

  const user = useUserStore(state => state.user);
  const currentSession = useUserStore(state => state.currentSession);
  const sessions = useUserStore(state => state.getSessions());
  const accesses = useUserStore(state => state.getAccesses());

  useEffect(() => {
    (async () => {
      queryGetUser();
      queryGetCurrentSession();
      queryGetSessions("newer", true);
      queryGetAccesses("newer", true);
    })();
  }, []);

  const logout = async () => {
    await queryLogout() && navigate("/welcome");
  }

  const getSessions = async (type: "older" | "newer", refresh?: boolean) => {
    if (!user) return;
    await queryGetSessions(type, refresh);
  }

  const getAccesses = async (type: "older" | "newer", refresh?: boolean) => {
    if (!user) return;
    await queryGetAccesses(type, refresh);
  }

  return (
    <>
      <div>
        <div>username: {user?.username}</div>
        <div>email: {user?.email}</div>
        <div>joined at: {user && date.unix(user.joinedAt).format('lll')}</div>
      </div>

      <br />

      <div>
        <button onClick={() => { navigate("/change_username") }}>change username</button>
        <br />
        <button onClick={() => { navigate("/change_email") }}>change email</button>
        <br />
        <button onClick={() => { navigate("/change_password") }}>change password</button>
      </div>

      <br />

      <div>
        <div>current session:</div>
        {currentSession ?
          <Session session={currentSession} /> :
          <Spinner />
        }
      </div>

      <br />

      <div>
        <div>all sessions:</div>
        <button onClick={() => { getSessions("older") }}>load older</button>
        <button onClick={() => { getSessions("newer") }}>load newer</button>
        <button onClick={() => { getSessions("newer", true) }}>refresh</button>
        {
          sessions.map(session => <Session session={session} key={session.id} />)
        }
      </div>

      <br />

      <div>
        <div>all accesses:</div>
        <button onClick={() => { getAccesses("older") }}>load older</button>
        <button onClick={() => { getAccesses("newer") }}>load newer</button>
        <button onClick={() => { getAccesses("newer", true) }}>refresh</button>
        {
          accesses.map(access => <Access access={access} key={access.id} />)
        }
      </div>

      <br />

      <button onClick={logout}>logout</button>
    </>
  )
}

export default Dashboard