import { ISession } from "@shared/session"
import { useUserStore } from "../stores/userStore";

interface Props {
  session: ISession;
}

function Session({ session }: Props) {
  const queryTerminateSession = useUserStore(state => state.queryTerminateSession);

  const terminate = () => {
    queryTerminateSession(session.id);
  }

  return (
    <div>
      <div>created at: {new Date(session.createdAt * 1000).toString()}</div>
      <div>expires at: {new Date(session.expiresAt * 1000).toString()}</div>
      <div>ip: {session.ip}</div>
      <div>user agent: {session.userAgent}</div>
      <button onClick={terminate}>terminate</button>
    </div>
  )
}

export default Session