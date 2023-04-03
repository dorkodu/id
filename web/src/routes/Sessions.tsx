import { useFeedProps, useWait } from "@/components/hooks";
import InfiniteScroll from "@/components/InfiniteScroll";
import { Session } from "@/components/Session";
import { useAppStore } from "@/stores/appStore";
import { useUserStore } from "@/stores/userStore";
import { useEffect } from "react";

export default function Sessions() {
  const state = useAppStore(state => state.options.sessions);
  const currentSession = useUserStore((state) => state.currentSession);
  const sessions = useUserStore((_state) => _state.getSessions(state.order));

  const queryGetCurrentSession = useUserStore((state) => state.queryGetCurrentSession);
  const queryGetSessions = useUserStore((state) => state.queryGetSessions);

  const [currentSessionProps, setCurrentSessionProps] = useFeedProps();
  const [sessionFeedProps, setSessionFeedProps] = useFeedProps();

  const getCurrentSession = async () => {
    if (currentSessionProps.loading) return;

    setCurrentSessionProps(s => ({ ...s, loading: true, status: undefined }));
    const status = await useWait(() => queryGetCurrentSession())();
    setCurrentSessionProps(s => ({ ...s, loading: false, status: status }));
  }

  const getSessions = async (type: "older" | "newer", refresh?: boolean, skipWaiting?: boolean) => {
    if (!skipWaiting && sessionFeedProps.loading) return;

    setSessionFeedProps(s => ({ ...s, loading: true, status: undefined }));
    const res = await useWait(() => queryGetSessions(type, refresh))();
    setSessionFeedProps(s => ({ ...s, loading: false, status: res.status, hasMore: res.length !== 0 }));
  }

  useEffect(() => {
    if (!currentSession) getCurrentSession();
    if (sessions.length === 0) getSessions(state.order, true);
  }, []);

  return (
    <InfiniteScroll
      refresh={() => getSessions(state.order, true)}
      next={() => getSessions(state.order, false, true)}
      hasMore={sessionFeedProps.hasMore}
    >
      {currentSession && <Session session={currentSession} currentSession />}
      {sessions.map((s) => s.id !== currentSession?.id && <Session key={s.id} session={s} />)}
    </InfiniteScroll>
  )
}