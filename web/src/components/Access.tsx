import type { IAccess } from "@api/types/access";

import { date } from "../lib/date";
import { util } from "../lib/util";
import { useUserStore } from "../stores/userStore";

import { Button, Center, Group, Paper, Table, Text } from "@mantine/core";

import {
  IconCalendarTime,
  IconClock,
  IconDeviceDesktop,
  IconHandFinger,
  IconMoodEmpty,
  IconNetwork,
  IconPlugConnected,
} from "@tabler/icons";

import { tokens } from "@dorkodu/prism";

export function AccessTable({ accesses }: { accesses: IAccess[] }) {
  return (
    <>
      {accesses.length == 0 && (
        <Group spacing={4} align="center" p={10}>
          <IconMoodEmpty color={tokens.color.gray(65)} />
          <Text color="dimmed">No Connected Services Found.</Text>
        </Group>
      )}

      {accesses.length >= 1 && (
        <Table
          horizontalSpacing="sm"
          verticalSpacing="xs"
          striped
          withBorder
          withColumnBorders>
          <thead>
            <tr>
              <th>
                <Group align="center">
                  <IconClock color={tokens.color.gray(60)} />
                  <Text>Create Time</Text>
                </Group>
              </th>
              <th>
                <Group align="center">
                  <IconCalendarTime color={tokens.color.gray(60)} />
                  <Text>Expire</Text>
                </Group>
              </th>
              <th>
                <Group align="center">
                  <IconNetwork color={tokens.color.gray(60)} />
                  <Text>IP</Text>
                </Group>
              </th>
              <th>
                <Group align="center">
                  <IconDeviceDesktop color={tokens.color.gray(60)} />
                  <Text>Device</Text>
                </Group>
              </th>
              <th>
                <Group align="center">
                  <IconPlugConnected color={tokens.color.gray(60)} />
                  <Text>Service</Text>
                </Group>
              </th>
              <th>
                <Center>
                  <IconHandFinger color={tokens.color.gray(60)} />
                </Center>
              </th>
            </tr>
          </thead>
          <tbody>
            {accesses.map((access) => (
              <AccessTableRow access={access} key={access.id} />
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

export function AccessTableRow({ access }: { access: IAccess }) {
  const queryRevokeAccess = useUserStore((state) => state.queryRevokeAccess);

  const terminate = () => {
    queryRevokeAccess(access.id);
  };

  return (
    <tr key={access.id}>
      <td>{date(access.createdAt).format("lll")}</td>
      <td>{date(access.expiresAt).format("lll")}</td>
      <td>{access.ip}</td>
      <td>{util.parseUserAgent(access.userAgent)}</td>
      <td>
        <Button color="red" onClick={terminate}>
          Terminate
        </Button>
      </td>
    </tr>
  );
}

export default AccessTableRow;
