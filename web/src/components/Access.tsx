import type { IAccess } from "@api/types/access";
import { date } from "../lib/date";
import { util } from "../lib/util";
import { useUserStore } from "../stores/userStore";

interface Props {
  access: IAccess;
}

function Access({ access }: Props) {
  const queryRevokeAccess = useUserStore(state => state.queryRevokeAccess);

  const terminate = () => {
    queryRevokeAccess(access.id);
  }

  return (
    <div>
      <div>created at: {date(access.createdAt).format('lll')}</div>
      <div>expires at: {date(access.expiresAt).format('lll')}</div>
      <div>ip: {access.ip}</div>
      <div>user agent: {util.parseUserAgent(access.userAgent)}</div>
      <div>service: {access.service}</div>
      <button onClick={terminate}>terminate</button>
    </div>
  )
}

export default Access