import { ActionIcon, Card, Divider, Flex, Menu, Text, } from "@mantine/core";

import { date } from "../lib/date";
import { util } from "../lib/util";

import {
  IconCalendarTime,
  IconClock,
  IconDeviceDesktop,
  IconDots,
  IconNetwork,
  IconPlugConnected,
  IconTrash,
} from "@tabler/icons";
import { tokens } from "@dorkodu/prism";
import { css } from "@emotion/react";
import { IAccess } from "@api/types/access";
import { useUserStore } from "../stores/userStore";
import { useTranslation } from "react-i18next";

interface Props {
  access: IAccess;
}

const flexNoShrink = css`flex-shrink: 0;`;
const fullWidth = css`width: 100%;`;

function Access({ access }: Props) {
  const { t } = useTranslation();
  const queryRevokeAccess = useUserStore((state) => state.queryRevokeAccess);
  const revokeAccess = () => queryRevokeAccess(access.id);

  return (
    <Card shadow="sm" p="md" m="md" radius="md" withBorder>
      <Flex direction="column" gap="xs">
        <Flex gap="xs" align="center">
          <Flex gap="xs" align="center" justify="space-betweens" css={fullWidth}>
            <IconClock color={tokens.color.gray(60)} css={flexNoShrink} />
            <Text>{date(access.createdAt).format("lll")}</Text>
          </Flex>

          <Menu shadow="md" radius="md" position="bottom-end">
            <Menu.Target>
              <ActionIcon color="dark"><IconDots /></ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                color="red"
                icon={<IconTrash size={14} />}
                onClick={revokeAccess}
              >
                {t("revokeAccess")}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>

        <Divider />

        <Flex gap="xs" align="center">
          <IconCalendarTime color={tokens.color.gray(60)} css={flexNoShrink} />
          <Text>{date(access.expiresAt).format("lll")}</Text>
        </Flex>

        <Divider />

        <Flex gap="xs" align="center">
          <IconNetwork color={tokens.color.gray(60)} css={flexNoShrink} />
          <Text>{access.ip}</Text>
        </Flex>

        <Divider />

        <Flex gap="xs" align="center">
          <IconDeviceDesktop color={tokens.color.gray(60)} css={flexNoShrink} />
          <Text>{util.parseUserAgent(access.userAgent)}</Text>
        </Flex>

        <Divider />

        <Flex gap="xs" align="center">
          <IconPlugConnected color={tokens.color.gray(60)} css={flexNoShrink} />
          <Text>{access.service}</Text>
        </Flex>
      </Flex>
    </Card>
  )
}

export default Access