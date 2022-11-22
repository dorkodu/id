import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Session from "../components/Session";
import Spinner from "../components/Spinner";
import { date } from "../lib/date";
import { useUserStore } from "../stores/userStore"

function Dashboard() {
  const navigate = useNavigate();

  const queryGetUser = useUserStore(state => state.queryGetUser);
  const queryGetCurrentSession = useUserStore(state => state.queryGetCurrentSession);
  const queryGetSessions = useUserStore(state => state.queryGetSessions);
  const queryLogout = useUserStore(state => state.queryLogout);

  const user = useUserStore(state => state.user);
  const currentSession = useUserStore(state => state.currentSession);
  const sessions = useUserStore(state => state.getSessions());

  useEffect(() => {
    (async () => {
      queryGetUser();
      queryGetCurrentSession();
      queryGetSessions("newer", true);
    })();
  }, []);

  const logout = async () => {
    await queryLogout() && navigate("/welcome");
  }

  const getSessions = async (type: "older" | "newer", refresh?: boolean) => {
    if (!user) return;
    await queryGetSessions(type, refresh);
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

      <button onClick={logout}>logout</button>
    </>
  )
}

export default Dashboard