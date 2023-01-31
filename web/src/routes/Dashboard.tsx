import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useUserStore } from "../stores/userStore";
import { request, sage } from "../stores/api";
import { array } from "../lib/array";

import {
  ActionIcon,
  AppShell,
  Button,
  Card,
  Flex,
  Header,
  SegmentedControl,
} from "@mantine/core";

import User from "../components/User";

import DorkoduIDKeyIcon from "@assets/dorkodu-id_key.svg";

import { IconArrowLeft, IconMenu2 } from "@tabler/icons";
import { css } from "@emotion/react";
import { Session } from "../components/Session";
import Access from "../components/Access";
import Footer from "../components/Footer";

const width = css`
  max-width: 768px;
  margin: 0 auto;
`;

interface State {
  show: "sessions" | "accesses";
}

function Dashboard() {
  const [state, setState] = useState<State>({ show: "sessions" });

  const navigate = useNavigate();

  const setUser = useUserStore((state) => state.setUser);
  const setCurrentSession = useUserStore((state) => state.setCurrentSession);
  const setSessions = useUserStore((state) => state.setSessions);
  const setAccesses = useUserStore((state) => state.setAccesses);

  const queryGetSessions = useUserStore((state) => state.queryGetSessions);
  const queryGetAccesses = useUserStore((state) => state.queryGetAccesses);

  const user = useUserStore((state) => state.user);
  const currentSession = useUserStore((state) => state.currentSession);
  const sessions = useUserStore((state) => state.session.sorted);
  const accesses = useUserStore((state) => state.access.sorted);

  const getSessions = async (type: "older" | "newer", refresh?: boolean) => {
    if (!user) return;
    await queryGetSessions(type, refresh);
  };

  const getAccesses = async (type: "older" | "newer", refresh?: boolean) => {
    if (!user) return;
    await queryGetAccesses(type, refresh);
  };

  const refresh = () => {
    switch (state.show) {
      case "sessions": getSessions("newer", true); break;
      case "accesses": getAccesses("newer", true); break;
    }
  }

  const loadNewer = () => {
    switch (state.show) {
      case "sessions": getSessions("newer"); break;
      case "accesses": getAccesses("newer"); break;
    }
  }

  const loadOlder = () => {
    switch (state.show) {
      case "sessions": getSessions("older"); break;
      case "accesses": getAccesses("older"); break;
    }
  }

  const routeMenu = () => {/*navigate("/menu")*/ };
  const goBack = () => navigate(-1);

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
  }

  if (!user || !currentSession) {
    return (<></>)
  }

  return (
    <AppShell padding={0} header={<DashboardHeader />}>
      <User user={user} />

      <Session session={currentSession} />

      <Card shadow="sm" p="lg" m="md" radius="md" withBorder>
        <Flex direction="column" gap="md">
          <SegmentedControl radius="md" fullWidth
            value={state.show}
            onChange={(show: typeof state.show) => setState({ ...state, show })}
            data={[
              { label: "Sessions", value: "sessions" },
              { label: "Accesses", value: "accesses" },
            ]}
          />

          <Button.Group>
            <Button radius="md" fullWidth variant="default" onClick={refresh}>Refresh</Button>
            <Button radius="md" fullWidth variant="default" onClick={loadNewer}>Load Newer</Button>
            <Button radius="md" fullWidth variant="default" onClick={loadOlder}>Load Older</Button>
          </Button.Group>
        </Flex>
      </Card>

      {state.show === "sessions" && sessions.map((s) => <Session key={s.id} session={s} />)}
      {state.show === "accesses" && accesses.map((a) => <Access key={a.id} access={a} />)}

      <Footer />
    </AppShell>
  );
};

export default Dashboard
