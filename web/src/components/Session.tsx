import { ISession } from "@api/types/session";
import { ActionIcon, Card, Divider, Flex, Menu, Text, } from "@mantine/core";

import { date } from "../lib/date";
import { util } from "../lib/util";

import {
  IconCalendarTime,
  IconClock,
  IconDeviceDesktop,
  IconDots,
  IconNetwork,
  IconTrash,
} from "@tabler/icons";
import { tokens } from "@dorkodu/prism";
import { css } from "@emotion/react";
import { useUserStore } from "../stores/userStore";
import { useTranslation } from "react-i18next";

interface Props {
  session: ISession;
}

const flexNoShrink = css`flex-shrink: 0;`;
const fullWidth = css`width: 100%;`;

export function Session({ session }: Props) {
  const { t } = useTranslation();
  const queryTerminateSession = useUserStore((state) => state.queryTerminateSession);
  const terminateSession = () => queryTerminateSession(session.id);

  return (
    <Card shadow="sm" p="md" m="md" radius="md" withBorder>
      <Flex direction="column" gap="xs">
        <Flex gap="xs" align="center">
          <Flex gap="xs" align="center" justify="space-betweens" css={fullWidth}>
            <IconClock color={tokens.color.gray(60)} css={flexNoShrink} />
            <Text>{date(session.createdAt).format("lll")}</Text>
          </Flex>

          <Menu shadow="md" radius="md" position="bottom-end">
            <Menu.Target>
              <ActionIcon color="dark"><IconDots /></ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                color="red"
                icon={<IconTrash size={14} />}
                onClick={terminateSession}
              >
                {t("terminateSession")}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>

        <Divider />

        <Flex gap="xs" align="center">
          <IconCalendarTime color={tokens.color.gray(60)} css={flexNoShrink} />
          <Text>{date(session.expiresAt).format("lll")}</Text>
        </Flex>

        <Divider />

        <Flex gap="xs" align="center">
          <IconNetwork color={tokens.color.gray(60)} css={flexNoShrink} />
          <Text>{session.ip}</Text>
        </Flex>

        <Divider />

        <Flex gap="xs" align="center">
          <IconDeviceDesktop color={tokens.color.gray(60)} css={flexNoShrink} />
          <Text>{util.parseUserAgent(session.userAgent)}</Text>
        </Flex>
      </Flex>
    </Card>
  )
}
