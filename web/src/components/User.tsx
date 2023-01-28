import { IUser } from "@api/types/user";
import { tokens } from "@dorkodu/prism";
import { css } from "@emotion/react";
import {
  createStyles,
  Avatar,
  Text,
  Card,
  Flex,
  Menu,
  ActionIcon,
  Grid,
} from "@mantine/core";
import {
  IconMailOpened,
  IconCalendar,
  IconDots,
  IconAsterisk,
  IconUser,
  IconLogout,
  IconAt,
} from "@tabler/icons";
import { date } from "../lib/date";
import DummyAvatar from "@assets/gilmour.webp";
import { useUserStore } from "../stores/userStore";

const useStyles = createStyles((theme) => ({
  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[5],
  },
}));

interface Props {
  user: IUser;
}

function User({ user }: Props) {
  const { classes: styles } = useStyles();

  const queryLogout = useUserStore((state) => state.queryLogout);

  return (
    <Card shadow="sm" p="lg" m="md" radius="md" withBorder css={css`overflow: visible;`}>
      <Grid gutter="md">
        <Grid.Col span="content">
          <Avatar src={DummyAvatar} size={100} radius="md" />
        </Grid.Col>

        <Grid.Col span="auto">
          <Flex direction="column">
            <Flex align="center" justify="space-between">
              <Text size="xl" weight={600}>Berk Cambaz</Text>

              <Menu shadow="md" radius="md">
                <Menu.Target>
                  <ActionIcon color="dark"><IconDots /></ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item icon={<IconUser size={14} />}>
                    edit profile
                  </Menu.Item>

                  <Menu.Item icon={<IconAt size={14} />}>
                    change email
                  </Menu.Item>

                  <Menu.Item icon={<IconAsterisk size={14} />}>
                    change password
                  </Menu.Item>

                  <Menu.Divider />

                  <Menu.Item
                    icon={<IconLogout size={14} />}
                    onClick={queryLogout}
                  >
                    log out
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Flex>


            <Flex>
              <Text style={{ color: tokens.color.gray(50), fontWeight: 750 }}>@</Text>
              <Text size="md" weight={500}>{user.username} </Text>
            </Flex>

            <Flex align="center" gap="md">
              <IconMailOpened className={styles.icon} />
              <Text size="sm" color="dimmed">
                {user.email}
              </Text>
            </Flex>

            <Flex align="center" gap="md">
              <IconCalendar className={styles.icon} />
              <Text size="sm" color="dimmed">{date(user.joinedAt).format("ll")}</Text>
            </Flex>
          </Flex>
        </Grid.Col>
      </Grid>
    </Card>
  )
}

export default User