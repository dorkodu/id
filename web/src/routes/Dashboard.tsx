import { FunctionComponent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SessionCard, SessionTable } from "../components/Session";
import { AccessTable } from "../components/Access";

import { useUserStore } from "../stores/userStore";
import { request, sage } from "../stores/api";
import { array } from "../lib/array";

import {
  ActionIcon,
  AppShell,
  Badge,
  Button,
  Container,
  Group,
  Image,
  Loader,
  Paper,
  Space,
  Title,
} from "@mantine/core";

import { FooterPlain } from "../components/_shared";
import { UserDashboardProfile } from "../components/User";
import { ColorToggleSegmented } from "../components/ColorToggle";

import DummyAvatar from "@assets/gilmour.webp";
import DorkoduIDKeyIcon from "@assets/dorkodu-id_key.svg";

import {
  IconArrowDown,
  IconArrowUp,
  IconMenu2,
  IconRefresh,
} from "@tabler/icons";

const DashboardPage: FunctionComponent = () => {
  const navigate = useNavigate();

  const setUser = useUserStore((state) => state.setUser);
  const setCurrentSession = useUserStore((state) => state.setCurrentSession);
  const setSessions = useUserStore((state) => state.setSessions);
  const setAccesses = useUserStore((state) => state.setAccesses);

  const queryGetSessions = useUserStore((state) => state.queryGetSessions);
  const queryGetAccesses = useUserStore((state) => state.queryGetAccesses);
  const queryLogout = useUserStore((state) => state.queryLogout);

  const user = useUserStore((state) => state.user);
  const currentSession = useUserStore((state) => state.currentSession);
  const sessions = useUserStore((state) => state.session.sorted);
  const accesses = useUserStore((state) => state.access.sorted);

  useEffect(() => {
    (async () => {
      const sessionAnchor = array.getAnchor(
        sessions,
        "id",
        "-1",
        "newer",
        true
      );
      const accessAnchor = array.getAnchor(accesses, "id", "-1", "newer", true);

      const res = await sage.get(
        {
          a: sage.query("getUser", undefined, { ctx: "ctx" }),
          b: sage.query("getCurrentSession", undefined, {
            ctx: "ctx",
            wait: "a",
          }),
          c: sage.query(
            "getSessions",
            { anchor: sessionAnchor, type: "newer" },
            { ctx: "ctx", wait: "a" }
          ),
          d: sage.query(
            "getAccesses",
            { anchor: accessAnchor, type: "newer" },
            { ctx: "ctx", wait: "a" }
          ),
        },
        (query) => request(query)
      );

      setUser(res?.a.data);
      setCurrentSession(res?.b.data);
      setSessions(res?.c.data, true);
      setAccesses(res?.d.data, true);
    })();
  }, []);

  const logout = async () => {
    (await queryLogout()) && navigate("/welcome");
  };

  const getSessions = async (type: "older" | "newer", refresh?: boolean) => {
    if (!user) return;
    await queryGetSessions(type, refresh);
  };

  const getAccesses = async (type: "older" | "newer", refresh?: boolean) => {
    if (!user) return;
    await queryGetAccesses(type, refresh);
  };

  //? Page Sections
  const DashboardProfile = () => {
    return (
      <Group my={20}>
        <UserDashboardProfile
          data={{
            name: "David Gilmour",
            username: "davidgilmour",
            avatar: DummyAvatar,
            bio: "The man who makes the guitar weep.",
            email: "dave@pinkfloyd.com",
            joinedAt: user?.joinedAt,
          }}
        />
        <Space h={10} />
        <Paper shadow="xs" p="md" withBorder>
          <Title size="h5" order={3} mb={10}>
            Edit Profile
          </Title>
          <Group spacing="xs">
            <Button
              size="xs"
              variant="default"
              onClick={() => {
                navigate("/change-username");
              }}>
              Change Username
            </Button>
            <Button
              size="xs"
              variant="default"
              onClick={() => {
                navigate("/change-email");
              }}>
              Change Email
            </Button>
            <Button
              size="xs"
              variant="default"
              onClick={() => {
                navigate("/change-password");
              }}>
              Change Password
            </Button>
          </Group>
        </Paper>
      </Group>
    );
  };

  const Sessions = () => {
    return (
      <>
        <Paper p="md" shadow="xs" maw={600} withBorder>
          <Title order={3}>
            <Group align="center" spacing={8}>
              <span>Current Session</span>
              <Badge color="green" variant="light" radius={8}>
                Active
              </Badge>
            </Group>
          </Title>
          {currentSession ? (
            <SessionCard session={currentSession} />
          ) : (
            <Loader variant="dots" color="green" />
          )}
        </Paper>

        <Space h={20} />

        <Paper p="md" shadow="xs" my={24} withBorder>
          <Title order={3}>All Sessions</Title>
          <Space h={10} />

          <Group spacing="xs">
            <Button
              variant="default"
              leftIcon={<IconArrowDown size={20} />}
              size="xs"
              onClick={() => {
                getSessions("older");
              }}>
              Load Older
            </Button>
            <Button
              variant="default"
              leftIcon={<IconArrowUp size={20} />}
              size="xs"
              onClick={() => {
                getSessions("newer");
              }}>
              Load Newer
            </Button>
            <Button
              variant="default"
              leftIcon={<IconRefresh size={20} />}
              size="xs"
              onClick={() => {
                getSessions("newer", true);
              }}>
              Refresh
            </Button>
          </Group>

          <Space h={20} />

          <SessionTable sessions={sessions} />
        </Paper>
      </>
    );
  };

  const Accesses = () => {
    return (
      <Paper p="md" shadow="xs" my={24} withBorder>
        <Title order={3}>Connected Services</Title>
        <Space h={10} />

        <Group spacing="xs">
          <Button
            variant="default"
            leftIcon={<IconRefresh size={20} />}
            size="xs"
            onClick={() => {
              getAccesses("newer", true);
            }}>
            Refresh
          </Button>

          {accesses.length >= 1 && (
            <>
              <Button
                variant="default"
                leftIcon={<IconArrowDown size={20} />}
                size="xs"
                onClick={() => {
                  getAccesses("older");
                }}>
                Load Older
              </Button>
              <Button
                variant="default"
                leftIcon={<IconArrowUp size={20} />}
                size="xs"
                onClick={() => {
                  getAccesses("newer");
                }}>
                Load Newer
              </Button>
            </>
          )}
        </Group>

        <Space h={20} />

        <AccessTable accesses={accesses} />
      </Paper>
    );
  };

  const Header = () => {
    return (
      <Paper shadow="xs" p={10} radius="md" withBorder>
        <Group position="apart">
          <Group>
            <Image src={DorkoduIDKeyIcon} height={36} width="auto" ml={4} />
            <Title size={24} order={1} weight={800}>
              Dashboard
            </Title>
          </Group>
          <Group>
            <ColorToggleSegmented />
            <ActionIcon variant="light" size={36}>
              <IconMenu2 />
            </ActionIcon>
          </Group>
        </Group>
      </Paper>
    );
  };

  return (
    <AppShell
      padding="md"
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}>
      <Container size={1000} my={25}>
        <Header />
        <Space h={24} />
        <DashboardProfile />
        <Sessions />
        <Accesses />
        <FooterPlain />
      </Container>
    </AppShell>
  );
};

export default DashboardPage;
