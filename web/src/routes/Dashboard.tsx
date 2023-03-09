import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useUserStore } from "../stores/userStore";
import { request, sage } from "../stores/api";

import { ActionIcon, AppShell, Card, Flex, Header } from "@mantine/core";

import User from "../components/User";

import DorkoduIDKeyIcon from "@assets/id.svg";

import { IconArrowLeft, IconMenu2, IconRefresh } from "@tabler/icons";
import { css } from "@emotion/react";
import { Session } from "../components/Session";
import Access from "../components/Access";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import CardPanel from "../components/cards/CardPanel";
import InfiniteScroll from "../components/InfiniteScroll";
import { useFeedProps, useWait } from "../components/hooks";
import CardAlert from "../components/cards/CardAlert";
import { useAppStore } from "../stores/appStore";
import { ISession } from "@api/types/session";
import { IAccess } from "@api/types/access";

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

  const getSessions = async (type: "older" | "newer", refresh?: boolean, skipWaiting?: boolean) => {
    if (!skipWaiting && sessionFeedProps.loading) return;

    setSessionFeedProps(s => ({ ...s, loading: true, status: undefined }));
    const res = await useWait(() => queryGetSessions(type, refresh))();
    setSessionFeedProps(s => ({ ...s, loading: false, status: res.status, hasMore: res.length !== 0 }));
  }

  const getAccesses = async (type: "older" | "newer", refresh?: boolean, skipWaiting?: boolean) => {
    if (!skipWaiting && accessFeedProps.loading) return;

    setAccessFeedProps(s => ({ ...s, loading: true, status: undefined }));
    const res = await useWait(() => queryGetAccesses(type, refresh))();
    setAccessFeedProps(s => ({ ...s, loading: false, status: res.status, hasMore: res.length !== 0 }));
  }

  const fetchRoute = async () => {
    setDashboardProps(s => ({ ...s, loading: true, status: undefined }));

    const sessionAnchor = useUserStore.getState().getSessionsAnchor(state.sessionOrder, true);
    const accessAnchor = useUserStore.getState().getAccessesAnchor(state.accessOrder, true);

    const res = await sage.get(
      {
        a: sage.query("getUser", undefined, { ctx: "ctx" }),
        b: sage.query("getCurrentSession", undefined, { ctx: "ctx", wait: "a", }),
        c: (state.feed === "sessions" ?
          sage.query(
            "getSessions",
            { anchor: sessionAnchor, type: state.sessionOrder },
            { ctx: "ctx", wait: "a" }
          ) :
          sage.query(
            "getAccesses",
            { anchor: accessAnchor, type: state.accessOrder },
            { ctx: "ctx", wait: "a" }
          )
        ),
      },
      (query) => useWait(() => request(query))()
    );

    const status = (
      !(!res?.a.data || res.a.error) &&
      !(!res?.b.data || res.b.error) &&
      !(!res?.c.data || res.c.error)
    );

    const user = res?.a.data;
    const currentSession = res?.b.data;
    const sessionsOrAccesses = res?.c.data;

    setUser(user);
    setCurrentSession(currentSession);
    setSessions(state.feed === "sessions" ? sessionsOrAccesses as ISession[] : [], true);
    setAccesses(state.feed === "accesses" ? sessionsOrAccesses as IAccess[] : [], true);

    setDashboardProps(s => ({ ...s, loading: false, status: status }));
    setSessionFeedProps(s => ({ ...s, hasMore: true }));
    setAccessFeedProps(s => ({ ...s, hasMore: true }));
  }


  const fetcher = async (feed: typeof state.feed, refresh?: boolean, skipWaiting?: boolean) => {
    switch (feed) {
      case "sessions": await getSessions(state.sessionOrder, refresh, skipWaiting); break;
      case "accesses": await getAccesses(state.accessOrder, refresh, skipWaiting); break;
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
    if (getLoading(state.feed)) return;

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


  const getLoading = (feed: typeof state.feed) => {
    switch (feed) {
      case "sessions": return sessionFeedProps.loading;
      case "accesses": return accessFeedProps.loading;
    }
  }

  const getHasMore = (feed: typeof state.feed) => {
    switch (feed) {
      case "sessions": return sessionFeedProps.hasMore;
      case "accesses": return accessFeedProps.hasMore;
    }
  }

  const routeMenu = () => { /*navigate("/menu")*/ };
  const goBack = () => navigate(-1);

  useEffect(() => {
    if (!user || !currentSession) fetchRoute()
    else getFeed(state.feed).length === 0 && fetcher(state.feed, false);
  }, [state.feed, state.sessionOrder, state.accessOrder]);

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
      <InfiniteScroll
        refresh={fetchRoute}
        next={() => fetcher(state.feed, false, true)}
        length={getFeed(state.feed).length}
        hasMore={getHasMore(state.feed)}
        hideLoader={!user || !currentSession}
      >
        {(!user || !currentSession || dashboardProps.loading) ?
          <>
            {dashboardProps.status === false &&
              <CardAlert
                title={t("error.text")}
                content={t("error.default")}
                type="error"
              />
            }
          </>

          :

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
                  ],
                  buttons: [{ icon: IconRefresh, onClick: fetchRoute }]
                },
              ]}
            />

            {state.feed === "sessions" && sessions.map((s) => <Session key={s.id} session={s} />)}
            {state.feed === "accesses" && accesses.map((a) => <Access key={a.id} access={a} />)}

          </>
        }
      </InfiniteScroll>

      {/* Don't display footer if the route is still loading or error*/}
      {!(!user || !currentSession || dashboardProps.loading) && <Footer />}
    </AppShell>
  )
}

export default Dashboard
