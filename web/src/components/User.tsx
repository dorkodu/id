import { tokens } from "@dorkodu/prism";
import { css } from "@emotion/react";
import {
  createStyles,
  Avatar,
  Text,
  Group,
  Alert,
  Stack,
  Card,
  Flex,
  Menu,
  ActionIcon,
  Grid,
} from "@mantine/core";
import {
  IconExclamationMark,
  IconMailOpened,
  IconCalendar,
  IconDots,
} from "@tabler/icons";
import { FunctionComponent } from "react";
import { date } from "../lib/date";

const useStyles = createStyles((theme) => ({
  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[5],
  },
}));

export const UserDashboardProfile: FunctionComponent<{
  data?: {
    name?: string;
    username?: string;
    email?: string;
    avatar?: string;
    bio?: string;
    joinedAt?: number;
  };
}> = ({ data }) => {
  const { classes: styles } = useStyles();

  if (!data)
    return (
      <Alert icon={<IconExclamationMark size={32} />} title="Oops!" color="red">
        Failed to load user.
      </Alert>
    );

  return (
    <Card shadow="sm" p="lg" m="md" radius="md" withBorder>
      <Grid gutter="md">
        <Grid.Col span="content">
          <Avatar src={data.avatar} size={100} radius="md" />
        </Grid.Col>

        <Grid.Col span="auto">
          <Flex direction="column">
            <Flex align="center" justify="space-between">
              <Text size="xl" weight={600}>{data.name}</Text>

              <Menu shadow="md" radius="md">
                <Menu.Target>
                  <ActionIcon color="dark"><IconDots /></ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                </Menu.Dropdown>
              </Menu>
            </Flex>


            <Flex>
              <Text style={{ color: tokens.color.gray(50), fontWeight: 750 }}>@</Text>
              <Text size="md" weight={500}>{data.username} </Text>
            </Flex>

            <Flex align="center" gap="md">
              <IconMailOpened className={styles.icon} />
              <Text size="sm" color="dimmed">
                {data.email}
              </Text>
            </Flex>

            <Flex align="center" gap="md">
              <IconCalendar className={styles.icon} />
              <Text size="sm" color="dimmed">{date(data.joinedAt).format("ll")}</Text>
            </Flex>
          </Flex>
        </Grid.Col>
      </Grid>
    </Card>
  );
};
