import { Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom"
import Spinner from "./components/Spinner";
import { useAppStore } from "./stores/appStore"

function App() {
  const loading = useAppStore(state => state.loading);
  const setLoading = useAppStore(state => state.setLoading);

  useEffect(() => { setLoading(false) }, []);

  return (
    <>
      <Suspense fallback={<Spinner />}>
        {loading ? <Spinner /> : <Outlet />}
      </Suspense>
    </>
  )
}

export default App
