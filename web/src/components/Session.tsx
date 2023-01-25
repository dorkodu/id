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

export function SessionCard({ session }: { session: ISession }) {
  return (
    <Table
      horizontalSpacing={4}
      verticalSpacing={4}
      mt={12}
      mb={4}
      align="center">
      <tbody>
        <tr>
          <td>
            <IconClock color={tokens.color.gray(60)} />
          </td>
          <td>
            <Text weight={600}>Create Time</Text>
          </td>
          <td>
            <Text>{date(session.createdAt).format("lll")}</Text>
          </td>
        </tr>
        <tr>
          <td>
            <IconCalendarTime color={tokens.color.gray(60)} />
          </td>
          <td>
            <Text weight={600}>Expire</Text>
          </td>
          <td>
            <Text>{date(session.expiresAt).format("lll")}</Text>
          </td>
        </tr>
        <tr>
          <td>
            <IconNetwork color={tokens.color.gray(60)} />
          </td>
          <td>
            <Text weight={600}>IP</Text>
          </td>
          <td>
            <Text>{session.ip}</Text>
          </td>
        </tr>
        <tr>
          <td>
            <IconDeviceDesktop color={tokens.color.gray(60)} />
          </td>
          <td>
            <Text weight={600}>Device</Text>
          </td>
          <td>
            <Text>{util.parseUserAgent(session.userAgent)}</Text>
          </td>
        </tr>
      </tbody>
    </Table>
  );
}
