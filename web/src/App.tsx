import { Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom"
import Spinner from "./components/Spinner";
import { request, router } from "./stores/api";
import { useAppStore } from "./stores/appStore"
import { useUserStore } from "./stores/userStore"

function App() {
  const loading = useAppStore(state => state.getLoading());

  useEffect(() => {
    (async () => {
      const res = await router.get(
        { a: router.query("auth") },
        (queries) => request(queries)
      )
      useUserStore.setState(state => { state.authorized = !!res?.a })
      useAppStore.setState(state => { state.loading.auth = false })
    })();
  }, [])

  return (
    <>
      <Suspense >
        {loading ? <Spinner /> : <Outlet />}
      </Suspense>
    </>
  )
}

export default App
