import Access from "@/components/Access";
import { useFeedProps, useWait } from "@/components/hooks";
import InfiniteScroll from "@/components/InfiniteScroll";
import { useAppStore } from "@/stores/appStore";
import { useUserStore } from "@/stores/userStore";
import { useEffect } from "react";

export default function Accesses() {
  const state = useAppStore(state => state.options.accesses);
  const accesses = useUserStore((_state) => _state.getAccesses(state.order));

  const queryGetAccesses = useUserStore((state) => state.queryGetAccesses);
  const [accessFeedProps, setAccessFeedProps] = useFeedProps();

  const getAccesses = async (type: "older" | "newer", refresh?: boolean, skipWaiting?: boolean) => {
    if (!skipWaiting && accessFeedProps.loading) return;

    setAccessFeedProps(s => ({ ...s, loading: true, status: undefined }));
    const res = await useWait(() => queryGetAccesses(type, refresh))();
    setAccessFeedProps(s => ({ ...s, loading: false, status: res.status, hasMore: res.length !== 0 }));
  }

  useEffect(() => { accesses.length === 0 && getAccesses(state.order, true) }, []);

  return (
    <InfiniteScroll
      refresh={() => getAccesses(state.order, true)}
      next={() => getAccesses(state.order, false, true)}
      hasMore={accessFeedProps.hasMore}
    >
      {accesses.map((a) => <Access key={a.id} access={a} />)}
    </InfiniteScroll>
  )
}