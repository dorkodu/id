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
import { useNavigate } from "react-router-dom";

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

  loading: boolean;
  status: boolean | undefined;
}

interface Props {
  user: IUser;
}

function User({ user }: Props) {
  const { classes: styles } = useStyles();

  const [state, setState] = useReducer((prev: State, next: State) => {
    const newState = { ...prev, ...next };
    return newState
  }, {
    name: "",
    username: "",
    bio: "",
    editing: false,
    loading: false,
    status: undefined,
  });

  const navigate = useNavigate();
  const queryEditProfile = useUserStore((state) => state.queryEditProfile);
  const queryLogout = useUserStore((state) => state.queryLogout);

  const changeEmail = () => navigate("/change-email");
  const changePassword = () => navigate("/change-password");

  const editProfile = async () => {
    if (state.loading) return;

    setState({ ...state, loading: true, status: undefined });
    const status = await queryEditProfile(state.name, state.username, state.bio);
    setState({ ...state, loading: false, status: status });
  }

  const startEdit = () => {
    setState({
      ...state,
      name: user.name,
      username: user.username,
      bio: user.bio,
      editing: true,
    })
  }

  const stopEdit = async (saveChanges: boolean) => {
    if (saveChanges) await editProfile();
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
              <Text size="xl" weight={600}>{user.name}</Text>

              <Menu shadow="md" radius="md">
                <Menu.Target>
                  <ActionIcon color="dark"><IconDots /></ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    icon={<IconUser size={14} />}
                    onClick={startEdit}
                  >
                    Edit Profile
                  </Menu.Item>

                  <Menu.Divider />

                  <Menu.Item
                    icon={<IconAt size={14} />}
                    onClick={changeEmail}
                  >
                    Change Email
                  </Menu.Item>

                  <Menu.Item
                    icon={<IconAsterisk size={14} />}
                    onClick={changePassword}
                  >
                    Change Password
                  </Menu.Item>

                  <Menu.Divider />

                  <Menu.Item
                    icon={<IconLogout size={14} />}
                    onClick={queryLogout}
                  >
                    Log Out
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Flex>


            <Flex>
              <Text style={{ color: tokens.color.gray(50), fontWeight: 750 }}>@</Text>
              <Text size="md" weight={500}>{user.username}</Text>
            </Flex>

            <Flex align="center" gap="md">
              <Text size="sm" color="dimmed">{user.bio}</Text>
            </Flex>

            <Flex align="center" gap="md">
              <IconMailOpened className={styles.icon} />
              <Text size="sm" color="dimmed">{user.email}</Text>
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
        title="Edit Profile"
      >
        <Flex direction="column" gap="md">
          <TextInput
            radius="md"
            label="Your Name"
            description="Use 1-64 chars."
            placeholder="Your name..."
            icon={<IconUserCircle size={16} />}
            defaultValue={state.name}
            onChange={(ev) => { setState({ ...state, name: ev.target.value }) }}
          />

          <TextInput
            radius="md"
            label="Your Username"
            description="Use 1-16 chars from letters (a-z or A-Z), digits (0-9), dot (.), and underscore (_), avoiding consecutive and at start/end dots/underscores."
            placeholder="Your username..."
            icon={<IconUser size={16} />}
            defaultValue={state.username}
            onChange={(ev) => { setState({ ...state, username: ev.target.value }) }}
          />

          <Textarea
            radius="md"
            placeholder="Your bio..."
            label="Your Bio"
            description="Maximum of 500 characters."
            defaultValue={state.bio}
            onChange={(ev) => { setState({ ...state, bio: ev.target.value }) }}
            autosize
          />

          <Flex justify="flex-end">
            <Button onClick={() => stopEdit(true)} radius="md">
              Confirm
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </Card>
  )
}

export default User