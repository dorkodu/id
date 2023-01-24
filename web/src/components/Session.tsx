import { ISession } from "@api/types/session";
import { Badge, Button, Card, Group, Image, Table, Text } from "@mantine/core";
import { date } from "../lib/date";
import { util } from "../lib/util";
import { useUserStore } from "../stores/userStore";
import Gilmour from "@assets/gilmour.webp";

export function SessionTable({ sessions }: { sessions: ISession[] }) {
  return (
    <Table
      horizontalSpacing="sm"
      verticalSpacing="xs"
      striped
      withBorder
      withColumnBorders>
      <thead>
        <tr>
          <th>Created At</th>
          <th>Expires At</th>
          <th>IP</th>
          <th>Device</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {sessions.map((session) => (
          <SessionTableRow session={session} />
        ))}
      </tbody>
    </Table>
  );
}

export function SessionTableRow({ session }: { session: ISession }) {
  const queryTerminateSession = useUserStore(
    (state) => state.queryTerminateSession
  );

  return (
    <tr key={session.id}>
      <td>{date(session.createdAt).format("lll")}</td>
      <td>{date(session.expiresAt).format("lll")}</td>
      <td>{session.ip}</td>
      <td>{util.parseUserAgent(session.userAgent)}</td>
      <td>
        <Button
          color="red"
          onClick={() => {
            queryTerminateSession(session.id);
          }}>
          Terminate
        </Button>
      </td>
    </tr>
  );
}

