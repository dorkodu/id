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
import UserAvatar from "@assets/avatar.webp";
import { useUserStore } from "../stores/userStore";
import { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { wrapContent } from "../styles/css";
import TextParser from "./TextParser";

const useStyles = createStyles((theme) => ({
  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark?.[3]
        : theme.colors.gray?.[5],
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

  const { t } = useTranslation();
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
      <Flex direction="column">
        <Flex justify="space-between" mb="xs">
          <Avatar src={UserAvatar} size={100} radius="md" />

          <Flex direction="row" align="flex-start">
            <Menu shadow="md" radius="md" position="bottom-end">
              <Menu.Target>
                <ActionIcon color="dark"><IconDots /></ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  icon={<IconUser size={14} />}
                  onClick={startEdit}
                >
                  {t("editProfile")}
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item
                  icon={<IconAt size={14} />}
                  onClick={changeEmail}
                >
                  {t("changeEmail")}
                </Menu.Item>

                <Menu.Item
                  icon={<IconAsterisk size={14} />}
                  onClick={changePassword}
                >
                  {t("changePassword")}
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item
                  icon={<IconLogout size={14} />}
                  onClick={queryLogout}
                >
                  {t("logout")}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Flex>
        </Flex>

        <Text size="xl" weight={600} css={wrapContent}>{user.name}</Text>

        <Flex>
          <Text style={{ color: tokens.color.gray(50), fontWeight: 750 }}>@</Text>
          <Text size="md" weight={500} css={wrapContent}>{user.username}</Text>
        </Flex>

        <Flex align="center" gap="md">
          <Text size="sm" color="dimmed" css={wrapContent}>
            <TextParser text={user.bio} />
          </Text>
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

      <Modal
        opened={state.editing}
        onClose={() => stopEdit(false)}
        title={t("editProfile")}
        lockScroll={false}
      >
        <Flex direction="column" gap="md">
          <TextInput
            radius="md"
            label={t("name")}
            description={t("nameDescription")}
            placeholder={t("enterName")}
            icon={<IconUserCircle size={16} />}
            defaultValue={state.name}
            onChange={(ev) => { setState({ ...state, name: ev.target.value }) }}
          />

          <TextInput
            radius="md"
            label={t("username")}
            description={t("usernameDescription")}
            placeholder={t("enterUsername")}
            icon={<IconUser size={16} />}
            defaultValue={state.username}
            onChange={(ev) => { setState({ ...state, username: ev.target.value }) }}
          />

          <Textarea
            radius="md"
            label={t("bio")}
            description={t("bioDescription")}
            placeholder={t("enterBio")}
            defaultValue={state.bio}
            onChange={(ev) => { setState({ ...state, bio: ev.target.value }) }}
            autosize
          />

          <Flex justify="flex-end">
            <Button onClick={() => stopEdit(true)} radius="md">
              {t("confirm")}
            </Button>
          </Flex>
        </Flex>
      </Modal>

    </Card>
  )
}

export default User