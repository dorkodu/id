import { ActionIcon, Card, CSSObject, Divider, Flex, Menu, Text, } from "@mantine/core";
import { util } from "../lib/util";
import { IconCalendarTime, IconClock, IconDeviceDesktop, IconDots, IconNetwork, IconPlugConnected, IconTrash } from "@tabler/icons-react";
import { IAccess } from "@api/types/access";
import { useUserStore } from "../stores/userStore";
import { useTranslation } from "react-i18next";
import i18n from "../lib/i18n";

interface Props {
  access: IAccess;
}

const flexNoShrink = { flexShrink: 0 } satisfies CSSObject;
const fullWidth = { width: "100%" } satisfies CSSObject;

function Access({ access }: Props) {
  const { t } = useTranslation();
  const queryRevokeAccess = useUserStore((state) => state.queryRevokeAccess);
  const revokeAccess = () => queryRevokeAccess(access.id);

  return (
    <Card shadow="sm" p="md" m="md" radius="md" withBorder>
      <Flex direction="column" gap="xs">
        <Flex gap="xs" align="center">
          <Flex gap="xs" align="center" justify="space-betweens" sx={fullWidth}>
            <IconClock style={flexNoShrink} />
            <Text>{new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium", timeStyle: "short" }).format(access.createdAt)}</Text>
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
          <Text>{new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium", timeStyle: "short" }).format(access.expiresAt)}</Text>
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