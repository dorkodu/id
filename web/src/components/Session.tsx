import { ISession } from "@shared/session"
import { date } from "../lib/date";
import { useUserStore } from "../stores/userStore";

interface Props {
  session: ISession;
}

function Session({ session }: Props) {
  const queryTerminateSession = useUserStore(state => state.queryTerminateSession);

  const terminate = () => {
    queryTerminateSession(session.id);
  }

  const getUserAgent = () => {
    return session.userAgent.split(",").filter(value => value !== "").join(" | ");
  }

  return (
    <div>
      <div>created at: {date.unix(session.createdAt).format('lll')}</div>
      <div>expires at: {date.unix(session.expiresAt).format('lll')}</div>
      <div>ip: {session.ip}</div>
      <div>user agent: {getUserAgent()}</div>
      <button onClick={terminate}>terminate</button>
    </div>
  )
}

export default Session