import { Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom"
import Spinner from "./components/Spinner";
import { useAppStore, useSetRoute } from "./stores/appStore"

function App() {
  const loading = useAppStore(state => state.loading);
  const setLoading = useAppStore(state => state.setLoading);

  const setRoute = useSetRoute();

  useEffect(() => { setLoading(false); setRoute("welcome"); }, []);

  return (
    <>
      <Suspense fallback={<Spinner />}>
        {loading ? <Spinner /> : <Outlet />}
      </Suspense>
    </>
  )
}

export default App
