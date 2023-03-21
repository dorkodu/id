import { ActionIcon, Card, CSSObject, Divider, Flex, Menu, Text, } from "@mantine/core";

import {
  IconCalendarTime,
  IconClock,
  IconDeviceDesktop,
  IconDots,
  IconNetwork,
  IconPlugConnected,
  IconTrash,
} from "@tabler/icons-react";
import { useTranslation } from "next-i18next";
import { useUserContext } from "@/stores/userContext";
import { IAccess } from "@/types/access";
import { util } from "@/lib/web/util";

interface Props {
  access: IAccess;
}

const flexNoShrink = { flexShrink: 0 } satisfies CSSObject
const fullWidth = { width: "100%" } satisfies CSSObject

function Access({ access }: Props) {
  const { t } = useTranslation();
  const queryRevokeAccess = useUserContext((state) => state.queryRevokeAccess);
  const revokeAccess = () => queryRevokeAccess(access.id);

  return (
    <Card shadow="sm" p="md" m="md" radius="md" withBorder>
      <Flex direction="column" gap="xs">
        <Flex gap="xs" align="center">
          <Flex gap="xs" align="center" justify="space-betweens" sx={fullWidth}>
            <IconClock style={flexNoShrink} />
            <Text>{new Date(access.createdAt).toString()}</Text>
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
          <IconCalendarTime style={flexNoShrink} />
          <Text>{new Date(access.expiresAt).toString()}</Text>
        </Flex>

        <Divider />

        <Flex gap="xs" align="center">
          <IconNetwork style={flexNoShrink} />
          <Text>{access.ip}</Text>
        </Flex>

        <Divider />

        <Flex gap="xs" align="center">
          <IconDeviceDesktop style={flexNoShrink} />
          <Text>{util.parseUserAgent(access.userAgent)}</Text>
        </Flex>

        <Divider />

        <Flex gap="xs" align="center">
          <IconPlugConnected style={flexNoShrink} />
          <Text>{access.service}</Text>
        </Flex>
      </Flex>
    </Card>
  )
}

export default Access