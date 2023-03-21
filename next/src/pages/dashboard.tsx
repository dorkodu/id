import Access from "@/components/Access";
import CardAlert from "@/components/cards/CardAlert";
import CardPanel from "@/components/cards/CardPanel";
import { useFeedProps, wait } from "@/components/hooks";
import InfiniteScroll from "@/components/InfiniteScroll";
import { Session } from "@/components/Session";
import User from "@/components/User";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useAppStore } from "@/stores/appStore";
import { useUserContext, useUserStore } from "@/stores/userContext";
import { IAccess } from "@/types/access";
import { ISession } from "@/types/session";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useEffect } from "react";
import { useTranslation } from "next-i18next";
import { request, sage } from "../stores/api";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import auth from "@/lib/api/controllers/auth";

function Dashboard() {
  const state = useAppStore(state => state.options.dashboard);

  const { t } = useTranslation();

  const setUser = useUserContext((state) => state.setUser);
  const setCurrentSession = useUserContext((state) => state.setCurrentSession);
  const setSessions = useUserContext((state) => state.setSessions);
  const setAccesses = useUserContext((state) => state.setAccesses);

  const queryGetSessions = useUserContext((state) => state.queryGetSessions);
  const queryGetAccesses = useUserContext((state) => state.queryGetAccesses);

  const user = useUserContext((state) => state.user);
  const currentSession = useUserContext((state) => state.currentSession);
  const sessions = useUserContext((_state) => _state.getSessions(state.sessionOrder));
  const accesses = useUserContext((_state) => _state.getAccesses(state.accessOrder));

  const [dashboardProps, setDashboardProps] = useFeedProps();
  const [sessionFeedProps, setSessionFeedProps] = useFeedProps();
  const [accessFeedProps, setAccessFeedProps] = useFeedProps();

  const getSessions = async (type: "older" | "newer", refresh?: boolean, skipWaiting?: boolean) => {
    if (!skipWaiting && sessionFeedProps.loading) return;

    setSessionFeedProps(s => ({ ...s, loading: true, status: undefined }));
    const res = await wait(() => queryGetSessions(type, refresh))();
    setSessionFeedProps(s => ({ ...s, loading: false, status: res.status, hasMore: res.length !== 0 }));
  }

  const getAccesses = async (type: "older" | "newer", refresh?: boolean, skipWaiting?: boolean) => {
    if (!skipWaiting && accessFeedProps.loading) return;

    setAccessFeedProps(s => ({ ...s, loading: true, status: undefined }));
    const res = await wait(() => queryGetAccesses(type, refresh))();
    setAccessFeedProps(s => ({ ...s, loading: false, status: res.status, hasMore: res.length !== 0 }));
  }

  const fetchRoute = async () => {
    setDashboardProps(s => ({ ...s, loading: true, status: undefined }));

    const sessionAnchor = useUserStore().getState().getSessionsAnchor(state.sessionOrder, true);
    const accessAnchor = useUserStore().getState().getAccessesAnchor(state.accessOrder, true);

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
      (query) => wait(() => request(query))()
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
      useUserStore().setState(_state => {
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

  useEffect(() => {
    if (!user || !currentSession) fetchRoute()
    else getFeed(state.feed).length === 0 && fetcher(state.feed, false);
  }, [state.feed, state.sessionOrder, state.accessOrder]);

  return (
    <>
      <Head>
        <title>Dorkodu ID</title>
        <meta name="title" content="Dorkodu ID" />
        <meta name="description" content="Your Digital Identity @ Dorkodu" />
      </Head>
      <main>
        <DashboardLayout>
          <InfiniteScroll
            refresh={fetchRoute}
            next={() => fetcher(state.feed, false, true)}
            hasMore={getHasMore(state.feed)}
          >
            {(!user || !currentSession) ?
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

                <Session session={currentSession} currentSession />

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

                {state.feed === "sessions" && sessions.map((s) => <Session key={s.id} session={s} />)}
                {state.feed === "accesses" && accesses.map((a) => <Access key={a.id} access={a} />)}

              </>
            }
          </InfiniteScroll>
        </DashboardLayout>
      </main>
    </>
  )
}

export default Dashboard

export const getServerSideProps: GetServerSideProps = async (props) => {
  const req = props.req as NextApiRequest;
  const res = props.res as NextApiResponse;

  const result = await auth.auth.executor({}, { req, res });
  const status = !(!result?.data || result.error);

  if (!status) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      }
    }
  }

  return {
    props: {
      ...(await serverSideTranslations(props.locale || "en", ['common'])),
    },
  }
}