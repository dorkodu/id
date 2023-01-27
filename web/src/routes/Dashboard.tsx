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
  Card,
  Flex,
  Group,
  Header,
  Loader,
  Space,
  Title,
} from "@mantine/core";

import { FooterPlain } from "../components/_shared";
import { UserDashboardProfile } from "../components/User";

import DummyAvatar from "@assets/gilmour.webp";
import DorkoduIDKeyIcon from "@assets/dorkodu-id_key.svg";

import {
  IconArrowDown,
  IconArrowLeft,
  IconArrowUp,
  IconMenu2,
  IconRefresh,
} from "@tabler/icons";
import { css } from "@emotion/react";

const width = css`
  max-width: 768px;
  margin: 0 auto;
`;

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
      const sessionAnchor = array.getAnchor(sessions, "id", "-1", "newer", true);
      const accessAnchor = array.getAnchor(accesses, "id", "-1", "newer", true);

      const res = await sage.get(
        {
          a: sage.query("getUser", undefined, { ctx: "ctx" }),
          b: sage.query("getCurrentSession",
            undefined,
            { ctx: "ctx", wait: "a", }
          ),
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

  const logout = async () => (await queryLogout()) && navigate("/welcome");

  const getSessions = async (type: "older" | "newer", refresh?: boolean) => {
    if (!user) return;
    await queryGetSessions(type, refresh);
  };

  const getAccesses = async (type: "older" | "newer", refresh?: boolean) => {
    if (!user) return;
    await queryGetAccesses(type, refresh);
  };

  const routeMenu = () => navigate("/menu");
  const goBack = () => navigate(-1);

  //? Page Sections
  const DashboardProfile = () => {
    return (
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
    );
  };

  const Sessions = () => {
    return (
      <>
        <Card shadow="sm" p="lg" m="md" radius="md" withBorder>
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
        </Card>

        <Card shadow="sm" p="lg" m="md" radius="md" withBorder>
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
        </Card>
      </>
    );
  };

  const Accesses = () => {
    return (
      <Card shadow="sm" p="lg" m="md" radius="md" withBorder>
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
      </Card>
    );
  };

  const DashboardHeader = () => {
    return (
      <Header css={width} px="md" pt="md" height={64} withBorder={false}>
        <Card css={css`height:100%;`} shadow="sm" p="lg" radius="md" withBorder>
          <Flex css={css`height:100%;`} align="center" justify="space-between">
            <ActionIcon
              color="dark"
              onClick={goBack}
              css={location.pathname !== "/dashboard" ? css`` : css`visibility: hidden;`}>
              <IconArrowLeft />
            </ActionIcon>

            <img src={DorkoduIDKeyIcon} width={28} height={28} />

            <ActionIcon onClick={routeMenu}><IconMenu2 /></ActionIcon>
          </Flex>
        </Card>
      </Header>
    );
  };

  return (
    <AppShell padding={0} header={<DashboardHeader />}>
      {/*<DashboardProfile />
      <Sessions />
      <Accesses />
      <FooterPlain />*/}
      <DashboardProfile />
    </AppShell>
  );
};

export default DashboardPage;
