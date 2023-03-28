import { ISession } from "@api/types/session";
import { ActionIcon, Card, Divider, Flex, Menu, Text, CSSObject } from "@mantine/core";
import { useUserStore } from "../stores/userStore";
import { useTranslation } from "react-i18next";
import { util } from "../lib/util";
import { IconCalendarTime, IconClock, IconDeviceDesktop, IconDots, IconKey, IconNetwork, IconTrash } from "@tabler/icons-react";
import i18n from "../lib/i18n";

interface Props {
  session: ISession;
  currentSession?: boolean;
}

const flexNoShrink = { flexShrink: 0 } satisfies CSSObject;
const fullWidth = { width: "100%" } satisfies CSSObject;

export function Session({ session, currentSession }: Props) {
  const { t } = useTranslation();
  const queryTerminateSession = useUserStore((state) => state.queryTerminateSession);
  const terminateSession = () => queryTerminateSession(session.id);

  const SessionMenu = () => (
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
  )

  return (
    <Card shadow="sm" p="md" m="md" radius="md" withBorder>
      <Flex direction="column" gap="xs">

        {currentSession &&
          <>
            <Flex gap="xs" align="center">
              <Flex gap="xs" align="center" justify="space-betweens" sx={fullWidth}>
                <IconKey style={flexNoShrink} />
                <Text>{t("currentSession")}</Text>
              </Flex>

              <SessionMenu />
            </Flex>

            <Divider />
          </>
        }

        <Flex gap="xs" align="center">
          <Flex gap="xs" align="center" justify="space-betweens" sx={fullWidth}>
            <IconClock style={flexNoShrink} />
            <Text>{new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium", timeStyle: "short" }).format(session.createdAt)}</Text>
          </Flex>

          {!currentSession && <SessionMenu />}
        </Flex>

        <Divider />

        <Flex gap="xs" align="center">
          <IconCalendarTime style={flexNoShrink} />
          <Text>{new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium", timeStyle: "short" }).format(session.expiresAt)}</Text>
        </Flex>

        <Divider />

        <Flex gap="xs" align="center">
          <IconNetwork style={flexNoShrink} />
          <Text>{session.ip}</Text>
        </Flex>

        <Divider />

        <Flex gap="xs" align="center">
          <IconDeviceDesktop style={flexNoShrink} />
          <Text>{util.parseUserAgent(session.userAgent)}</Text>
        </Flex>

      </Flex>
    </Card>
  )
}
