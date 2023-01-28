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
  Modal,
  TextInput,
  Textarea,
  Button,
} from "@mantine/core";
import {
  IconMailOpened,
  IconCalendar,
  IconDots,
  IconAsterisk,
  IconUser,
  IconLogout,
  IconAt,
  IconUserCircle,
} from "@tabler/icons";
import { date } from "../lib/date";
import DummyAvatar from "@assets/gilmour.webp";
import { useUserStore } from "../stores/userStore";
import { useReducer } from "react";

const useStyles = createStyles((theme) => ({
  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[5],
  },
}));

interface State {
  name: string;
  username: string;
  bio: string;

  editing: boolean;
}

interface Props {
  user: IUser;
}

function User({ user }: Props) {
  const { classes: styles } = useStyles();

  const [state, setState] = useReducer((prev: State, next: State) => {
    const newState = { ...prev, ...next };
    return newState
  }, { name: "", username: "", bio: "", editing: false });

  const queryLogout = useUserStore((state) => state.queryLogout);

  const startEdit = () => {
    setState({
      ...state,
      name: "Berk Cambaz",
      username: user.username,
      bio: "hello, world",
      editing: true,
    })
  }

  const stopEdit = (_saveChanges: boolean) => {
    setState({ ...state, editing: false });
  }

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
                  <Menu.Item
                    icon={<IconUser size={14} />}
                    onClick={startEdit}
                  >
                    edit profile
                  </Menu.Item>

                  <Menu.Divider />

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

      <Modal
        opened={state.editing}
        onClose={() => stopEdit(false)}
        title="edit profile"
      >
        <Flex direction="column" gap="md">
          <TextInput
            radius="md"
            placeholder="name..."
            label="name"
            description="your name"
            icon={<IconUserCircle size={16} />}
            defaultValue={state.name}
            onChange={(ev) => { setState({ ...state, name: ev.target.value }) }}
          />

          <TextInput
            radius="md"
            placeholder="username..."
            label="username"
            description="your username"
            icon={<IconUser size={16} />}
            defaultValue={state.username}
            onChange={(ev) => { setState({ ...state, username: ev.target.value }) }}
          />

          <Textarea
            radius="md"
            placeholder="bio..."
            label="bio"
            description="your biography"
            defaultValue={state.bio}
            onChange={(ev) => { setState({ ...state, bio: ev.target.value }) }}
            autosize
          />

          <Flex justify="flex-end">
            <Button onClick={() => stopEdit(true)} radius="md">
              confirm
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </Card>
  )
}

export default User