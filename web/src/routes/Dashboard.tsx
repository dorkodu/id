import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useUserStore } from "../stores/userStore";
import { request, sage } from "../stores/api";

import { ActionIcon, AppShell, Card, Flex, Header } from "@mantine/core";

import User from "../components/User";

import DorkoduIDKeyIcon from "@assets/id.svg";

import { IconArrowLeft, IconMenu2 } from "@tabler/icons";
import { css } from "@emotion/react";
import { Session } from "../components/Session";
import Access from "../components/Access";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import CardPanel from "../components/cards/CardPanel";
import InfiniteScroll from "../components/InfiniteScroll";
import { useFeedProps, useWait } from "../components/hooks";
import CardLoader from "../components/cards/CardLoader";
import CardAlert from "../components/cards/CardAlert";
import { useAppStore } from "../stores/appStore";

const width = css`
  max-width: 768px;
  margin: 0 auto;
`;

function Dashboard() {
  const state = useAppStore(state => state.options.dashboard);

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
  const sessions = useUserStore((_state) => _state.getSessions(state.sessionOrder));
  const accesses = useUserStore((_state) => _state.getAccesses(state.accessOrder));

  const [dashboardProps, setDashboardProps] = useFeedProps();
  const [sessionFeedProps, setSessionFeedProps] = useFeedProps();
  const [accessFeedProps, setAccessFeedProps] = useFeedProps();

  const getSessions = async (type: "older" | "newer", refresh?: boolean) => {
    if (!user) return;
    if (sessionFeedProps.loader) return;

    setSessionFeedProps(s => ({ ...s, loader: refresh ? "top" : "bottom", status: undefined }));
    const status = await useWait(() => queryGetSessions(type, refresh))();
    setSessionFeedProps(s => ({ ...s, loader: undefined, status: status }));
  }

  const getAccesses = async (type: "older" | "newer", refresh?: boolean) => {
    if (!user) return;
    if (accessFeedProps.loader) return;

    setAccessFeedProps(s => ({ ...s, loader: refresh ? "top" : "bottom", status: undefined }));
    const status = await useWait(() => queryGetAccesses(type, refresh))();
    setAccessFeedProps(s => ({ ...s, loader: undefined, status: status }));
  }


  const fetcher = async (feed: typeof state.feed, refresh?: boolean) => {
    switch (feed) {
      case "sessions": await getSessions(state.sessionOrder, refresh); break;
      case "accesses": await getAccesses(state.accessOrder, refresh); break;
    }
  }


  const getFeed = (feed: typeof state.feed) => {
    switch (feed) {
      case "sessions": return sessions;
      case "accesses": return accesses;
    }
  }

  const changeFeed = (value: string) => {
    if (value === "sessions" || value === "accesses") {
      useAppStore.setState(s => { s.options.dashboard.feed = value });
    }
  }


  const getOrder = () => {
    switch (state.feed) {
      case "sessions": return state.sessionOrder;
      case "accesses": return state.accessOrder;
    }
  }

  const changeOrder = (value: string) => {
    /**
     * Can't change feed order if the current feed is loading.
     * It fixes a bug which occurs when user changed order very fast,
     * for ex. changes newer -> older -> newer, then the feed will show,
     * older posts in newer order, which not the desired outcome.
     */
    if (getLoader(state.feed)) return;

    if (value === "newer" || value === "older") {
      useAppStore.setState(s => {
        switch (state.feed) {
          case "sessions": s.options.dashboard.sessionOrder = value; break;
          case "accesses": s.options.dashboard.accessOrder = value; break;
        }
      });

      // Clear feed when changing the order
      useUserStore.setState(_state => {
        switch (state.feed) {
          case "sessions": _state.session.entities = {}; break;
          case "accesses": _state.access.entities = {}; break;
        }
      });
    }
  }


  const getLoader = (feed: typeof state.feed) => {
    switch (feed) {
      case "sessions": return sessionFeedProps.loader;
      case "accesses": return accessFeedProps.loader;
    }
  }


  const routeMenu = () => { /*navigate("/menu")*/ };
  const goBack = () => navigate(-1);

  useEffect(() => {
    getFeed(state.feed).length === 0 && fetcher(state.feed, false);
  }, [state.feed, state.sessionOrder, state.accessOrder]);

  useEffect(() => {
    (async () => {
      if (user && currentSession) return;
      
      setDashboardProps(s => ({ ...s, loader: "top", status: undefined }));

      const sessionAnchor = useUserStore.getState().getSessionsAnchor("newer", true);
      const accessAnchor = useUserStore.getState().getAccessesAnchor("newer", true);

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

      setDashboardProps(s => ({ ...s, loader: undefined, status: status }));
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

            <img src={DorkoduIDKeyIcon} width={28} height={28} alt="Dorkodu ID" />

            <ActionIcon onClick={routeMenu}><IconMenu2 /></ActionIcon>
          </Flex>
        </Card>
      </Header>
    )
  }

  return (
    <AppShell padding={0} header={<DashboardHeader />}>
      {(!user || !currentSession || dashboardProps.loader) &&
        <>
          {dashboardProps.loader && <CardLoader />}
          {dashboardProps.status === false &&
            <CardAlert
              title={t("error.text")}
              content={t("error.default")}
              type="error"
            />
          }
        </>
      }

      {!(!user || !currentSession || dashboardProps.loader) &&
        <>
          <User user={user} />

          <Session session={currentSession} />

          <CardPanel
            segments={[
              {
                value: state.feed,
                setValue: changeFeed,
                label: t("show"),
                data: [
                  { label: t("sessions"), value: "sessions" },
                  { label: t("accesses"), value: "accesses" },
                ]
              },
              {
                value: getOrder(),
                setValue: changeOrder,
                label: t("order"),
                data: [
                  { label: t("newer"), value: "newer" },
                  { label: t("older"), value: "older" },
                ]
              },
            ]}
          />

          <InfiniteScroll
            onBottom={() => fetcher(state.feed, false)}
            loader={getLoader(state.feed)}
          >
            {state.feed === "sessions" && sessions.map((s) => <Session key={s.id} session={s} />)}
            {state.feed === "accesses" && accesses.map((a) => <Access key={a.id} access={a} />)}
          </InfiniteScroll>
          <Footer />
        </>
      }
    </AppShell>
  )
}

export default Dashboard
