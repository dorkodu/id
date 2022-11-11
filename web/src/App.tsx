import { Suspense, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom"
import Spinner from "./components/Spinner";
import { useAppStore } from "./stores/appStore"
import { useUserStore } from "./stores/userStore";

function App() {
  const navigate = useNavigate();

  const queryAuth = useUserStore(state => state.queryAuth);
  const loading = useAppStore(state => state.loading);
  const setLoading = useAppStore(state => state.setLoading);

  useEffect(() => {
    (async () => {
      if (await queryAuth()) navigate("/dashboard");
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <Suspense fallback={<Spinner />}>
        {loading ? <Spinner /> : <Outlet />}
      </Suspense>
    </>
  )
}

export default App
