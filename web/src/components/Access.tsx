import type { IAccess } from "@shared/access";
import { date } from "../lib/date";
import { util } from "../lib/util";
import { useUserStore } from "../stores/userStore";

interface Props {
  session: IAccess;
}

function Session({ session }: Props) {
  const queryTerminateSession = useUserStore(state => state.queryTerminateSession);

  const terminate = () => {
    queryTerminateSession(session.id);
  }

  return (
    <div>
      <div>created at: {date.unix(session.createdAt).format('lll')}</div>
      <div>expires at: {date.unix(session.expiresAt).format('lll')}</div>
      <div>ip: {session.ip}</div>
      <div>user agent: {util.parseUserAgent(session.userAgent)}</div>
      <div>service: {session.service}</div>
      <button onClick={terminate}>terminate</button>
    </div>
  )
}

export default Session