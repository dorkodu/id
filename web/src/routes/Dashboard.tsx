import { useEffect } from "react";
import { useUserStore } from "../stores/userStore";
import User from "../components/User";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "../components/InfiniteScroll";
import { useFeedProps, useWait } from "../components/hooks";
import CardAlert from "../components/cards/CardAlert";

export default function Dashboard() {
  const { t } = useTranslation();

  const queryGetUser = useUserStore((state) => state.queryGetUser);
  const user = useUserStore((state) => state.user);
  const [dashboardProps, setDashboardProps] = useFeedProps();

  const getUser = async () => {
    if (dashboardProps.loading) return;
    setDashboardProps(s => ({ ...s, loading: true, status: undefined }));
    const status = await useWait(() => queryGetUser())();
    setDashboardProps(s => ({ ...s, loading: false, status: status }));
  }

  useEffect(() => { !user && getUser() }, []);

  return (
    <InfiniteScroll
      refresh={getUser}
      next={() => Promise.resolve()}
      hasMore={true}
    >
      {(!user) ?
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
        </>
      }
    </InfiniteScroll>
  )
}