import {
  createStyles,
  Avatar,
  Text,
  Group,
  Alert,
  Paper,
  Stack,
} from "@mantine/core";
import {
  IconPhoneCall,
  IconAt,
  IconExclamationMark,
  IconMailOpened,
  IconCalendar,
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
    <Paper shadow="xs" p="md" maw={600}>
      <Group>
        <Avatar src={data.avatar} size={94} radius="md" />
        <Stack spacing={2}>
          <Text size="xl" weight={600}>
            {data.username}
          </Text>

          <Text size="md" weight={500}>
            {data.name}
          </Text>

          <Group noWrap spacing={10} mt={3} align="center">
            <IconMailOpened size={24} className={styles.icon} />
            <Text size="sm" color="dimmed">
              {data.email}
            </Text>
          </Group>

          <Group noWrap spacing={10} mt={5} align="center">
            <IconCalendar size={24} className={styles.icon} />
            <Text size="sm" color="dimmed">
              {data.joinedAt && date(data.joinedAt).format("lll")}
            </Text>
          </Group>
        </Stack>
      </Group>
    </Paper>
  );
};
