import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useUserStore } from "../stores/userStore";
import { request, sage } from "../stores/api";
import { array } from "../lib/array";

import { ActionIcon, AppShell, Card, Flex, Header } from "@mantine/core";

import User from "../components/User";

import DorkoduIDKeyIcon from "@assets/dorkodu-id_key.svg";

import { IconArrowBigDownLine, IconArrowBigUpLine, IconArrowLeft, IconMenu2, IconRefresh } from "@tabler/icons";
import { css } from "@emotion/react";
import { Session } from "../components/Session";
import Access from "../components/Access";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import CardPanel from "../components/cards/CardPanel";
import InfiniteScroll from "../components/InfiniteScroll";
import { useWait } from "../components/hooks";
import CardLoader from "../components/cards/CardLoader";
import CardAlert from "../components/cards/CardAlert";

const width = css`
  max-width: 768px;
  margin: 0 auto;
`;

interface State {
  user: {
    loading: boolean;
    status: boolean | undefined;
  }

  session: {
    loading: boolean;
    status: boolean | undefined;
  }

  access: {
    loading: boolean;
    status: boolean | undefined;
  }

  loader: "top" | "bottom" | "mid" | undefined;
  show: "sessions" | "accesses";
}

function Dashboard() {
  const [state, setState] = useState<State>({
    user: { loading: false, status: undefined },
    session: { loading: false, status: undefined },
    access: { loading: false, status: undefined },
    loader: "mid",
    show: "sessions"
  });

  const { t } = useTranslation();
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
    if (state.session.loading) return;

    setState(s => ({
      ...s,
      session: { ...s.session, loading: true, status: undefined },
      loader: refresh ? "mid" : type === "newer" ? "top" : "bottom",
    }));
    const status = await useWait(() => queryGetSessions(type, refresh))();
    setState(s => ({
      ...s,
      session: { ...s.session, loading: false, status: status },
      loader: undefined
    }));
  }

  const getAccesses = async (type: "older" | "newer", refresh?: boolean) => {
    if (!user) return;
    if (state.access.loading) return;

    setState(s => ({
      ...s,
      access: { ...s.access, loading: true, status: undefined },
      loader: refresh ? "mid" : type === "newer" ? "top" : "bottom",
    }));
    const status = await useWait(() => queryGetAccesses(type, refresh))();
    setState(s => ({
      ...s,
      access: { ...s.access, loading: false, status: status },
      loader: undefined
    }));
  }

  const refresh = async () => {
    switch (state.show) {
      case "sessions": await getSessions("newer", true); break;
      case "accesses": await getAccesses("newer", true); break;
    }
  }

  const loadNewer = async () => {
    switch (state.show) {
      case "sessions": await getSessions("newer"); break;
      case "accesses": await getAccesses("newer"); break;
    }
  }

  const loadOlder = async () => {
    switch (state.show) {
      case "sessions": await getSessions("older"); break;
      case "accesses": await getAccesses("older"); break;
    }
  }

  const changeShow = (value: string) => {
    if (value === "sessions" || value === "accesses") {
      setState(s => ({ ...s, show: value }));
    }
  }

  const routeMenu = () => { /*navigate("/menu")*/ };
  const goBack = () => navigate(-1);

  useEffect(() => {
    (async () => {
      setState(s => ({
        ...s,
        user: { ...s.user, loading: true, status: undefined },
        loader: "mid",
      }));

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
        (query) => useWait(() => request(query))()
      );

      const status = (
        !(!res?.a.data || res.a.error) &&
        !(!res?.b.data || res.b.error) &&
        !(!res?.c.data || res.c.error) &&
        !(!res?.d.data || res.d.error)
      );

      setUser(res?.a.data);
      setCurrentSession(res?.b.data);
      setSessions(res?.c.data, true);
      setAccesses(res?.d.data, true);

      setState(s => ({
        ...s,
        user: { ...s.user, loading: false, status: status },
        loader: undefined,
      }));
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
    )
  }

  return (
    <AppShell padding={0} header={<DashboardHeader />}>
      {(!user || !currentSession || state.user.loading) &&
        <>
          {state.user.loading && <CardLoader />}
          {state.user.status === false &&
            <CardAlert
              title={t("error.text")}
              content={t("error.default")}
              type="error"
            />
          }
        </>
      }

      {!(!user || !currentSession || state.user.loading) &&
        <>
          <User user={user} />

          <Session session={currentSession} />

          <CardPanel
            segments={[
              {
                value: state.show,
                setValue: changeShow,
                label: t("show"),
                data: [
                  { label: t("sessions"), value: "sessions" },
                  { label: t("accesses"), value: "accesses" },
                ]
              }
            ]}

            buttons={[
              { onClick: refresh, text: <IconRefresh /> },
              { onClick: loadOlder, text: <IconArrowBigDownLine /> },
              { onClick: loadNewer, text: <IconArrowBigUpLine /> },
            ]}
          />

          <InfiniteScroll
            onBottom={loadOlder}
            loaders={{ top: state.loader === "top", bottom: state.loader === "bottom", mid: state.loader === "mid", }}
          >
            {state.show === "sessions" && sessions.map((s) => <Session key={s.id} session={s} />)}
            {state.show === "accesses" && accesses.map((a) => <Access key={a.id} access={a} />)}
          </InfiniteScroll>
          <Footer />
        </>
      }
    </AppShell>
  )
}

export default Dashboard
