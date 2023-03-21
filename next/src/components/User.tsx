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
  Alert,
} from "@mantine/core";
import {
  IconMailOpened,
  IconCalendar,
  IconDots,
  IconAsterisk,
  IconUser,
  IconAt,
  IconUserCircle,
  IconAlertCircle,
} from "@tabler/icons-react";
import UserAvatar from "@assets/avatar.webp";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { wrapContent } from "../styles/css";
import TextParser, { PieceType } from "./TextParser";
import { useFocusWithin } from "@mantine/hooks";
import InputRequirements, { getRequirement, getRequirementError } from "./popovers/InputRequirements";
import { wait } from "./hooks";
import { useUserContext } from "@/stores/userContext";
import CustomLink from "./CustomLink";
import OverlayLoader from "./loaders/OverlayLoader";
import { IUser } from "@/types/user";

console.log(UserAvatar)

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
  status: "ok" | "error" | "username" | undefined;
}

interface Props {
  user: IUser;
}

function User({ user }: Props) {
  const { classes: styles } = useStyles();

  const [state, setState] = useState<State>({
    name: "",
    username: "",
    bio: "",
    editing: false,
    loading: false,
    status: undefined,
  });

  const { t } = useTranslation();
  const queryEditProfile = useUserContext((state) => state.queryEditProfile);

  const editProfile = async () => {
    if (state.loading) return false;

    setState(s => ({ ...s, loading: true }));
    const status = await wait(() => queryEditProfile(state.name, state.username, state.bio))();
    setState(s => ({ ...s, loading: false, status: status }));

    return status === "ok";
  }

  const startEdit = () => {
    setState(s => ({
      ...s,
      name: user.name,
      username: user.username,
      bio: user.bio,
      editing: true,
    }));
  }

  const stopEdit = async (saveChanges: boolean) => {
    let status = false;
    if (saveChanges) status = !(await editProfile());

    setState(s => ({ ...s, editing: status }));
  }

  // Necessary stuff for input validation & error messages
  const [inputReady, setInputReady] = useState({ name: false, username: false, bio: false });
  const { ref: nameRef, focused: nameFocused } = useFocusWithin();
  const { ref: usernameRef, focused: usernameFocused } = useFocusWithin();
  const { ref: bioRef, focused: bioFocused } = useFocusWithin();
  useEffect(() => {
    setInputReady(s => ({
      ...s,
      name: nameFocused || s.name,
      username: usernameFocused || s.username,
      bio: bioFocused || s.bio,
    }))
  }, [nameFocused, usernameFocused, bioFocused]);

  return (
    <Card shadow="sm" p="md" m="md" radius="md" withBorder style={{ overflow: "visible" }}>
      <Flex direction="column">
        <Flex justify="space-between" mb="xs">
          <Avatar src={UserAvatar.src} size={100} radius="md" />

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

                <CustomLink href="/change-email">
                  <Menu.Item icon={<IconAt size={14} />}>
                    {t("changeEmail")}
                  </Menu.Item>
                </CustomLink>

                <CustomLink href="/change-password">
                  <Menu.Item icon={<IconAsterisk size={14} />}>
                    {t("changePassword")}
                  </Menu.Item>
                </CustomLink>
              </Menu.Dropdown>
            </Menu>
          </Flex>
        </Flex>

        <Text size="xl" weight={600} sx={wrapContent}>
          <TextParser text={user.name} types={[PieceType.Emoji]} />
        </Text>

        <Flex>
          <Text style={{ fontWeight: 750 }}>@</Text>
          <Text size="md" weight={500} sx={wrapContent}>{user.username}</Text>
        </Flex>

        <Flex align="center" gap="md">
          <Text size="sm" color="dimmed" sx={wrapContent}>
            <TextParser text={user.bio} />
          </Text>
        </Flex>

        <Flex align="center" gap="md">
          <IconMailOpened className={styles.icon} />
          <Text size="sm" color="dimmed">{user.email}</Text>
        </Flex>

        <Flex align="center" gap="md">
          <IconCalendar className={styles.icon} />
          <Text size="sm" color="dimmed">{new Date(user.joinedAt).toString()}</Text>
        </Flex>
      </Flex>

      <Modal
        opened={state.editing}
        onClose={() => stopEdit(false)}
        title={t("editProfile")}
        lockScroll={false}
      >
        {state.loading && <OverlayLoader />}

        <Flex direction="column" gap="md">
          <InputRequirements
            value={state.name}
            requirements={getRequirement(t, "name")}
          >
            <TextInput
              radius="md"
              label={t("name")}
              placeholder={t("enterName")}
              icon={<IconUserCircle size={16} />}
              defaultValue={state.name}
              onChange={(ev) => { setState(s => ({ ...s, name: ev.target.value })) }}
              error={inputReady.name && getRequirementError(t, "name", state.name, nameFocused)}
              ref={nameRef}
            />
          </InputRequirements>

          <InputRequirements
            value={state.username}
            requirements={getRequirement(t, "username")}
          >
            <TextInput
              radius="md"
              label={t("username")}
              placeholder={t("enterUsername")}
              icon={<IconUser size={16} />}
              defaultValue={state.username}
              onChange={(ev) => { setState(s => ({ ...s, username: ev.target.value })) }}
              error={inputReady.username && getRequirementError(t, "username", state.username, usernameFocused)}
              ref={usernameRef}
            />
          </InputRequirements>

          <InputRequirements
            value={state.bio}
            requirements={getRequirement(t, "bio")}
          >
            <Textarea
              radius="md"
              label={t("bio")}
              placeholder={t("enterBio")}
              defaultValue={state.bio}
              onChange={(ev) => { setState(s => ({ ...s, bio: ev.target.value })) }}
              autosize
              error={inputReady.bio && getRequirementError(t, "bio", state.bio, bioFocused)}
              ref={bioRef}
            />
          </InputRequirements>

          <Flex justify="flex-end">
            <Button onClick={() => stopEdit(true)} radius="md">
              {t("confirm")}
            </Button>
          </Flex>

          {state.status && state.status !== "ok" &&
            <Alert
              icon={<IconAlertCircle size={24} />}
              title={t("error.text")}
              color="red"
              variant="light"
            >
              {state.status === "error" && t("error.default")}
              {state.status === "username" && t("error.usernameUsed")}
            </Alert>
          }
        </Flex>
      </Modal>

    </Card>
  )
}

export default User