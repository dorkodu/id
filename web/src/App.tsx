import { css, Global } from "@emotion/react";
import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";
import CenterLoader from "./components/cards/CenterLoader";
import OverlayLoader from "./components/cards/OverlayLoader";
import { useAppStore } from "./stores/appStore";
import { useUserStore } from "./stores/userStore";
import theme from "./styles/theme";
import UpdateSW from "./components/modals/UpdateSW";
import { useRegisterSW } from "virtual:pwa-register/react";

const width = css`
  max-width: 768px;
  margin: 0 auto;
`;

const global = css`
  body {
    ${width}
    overflow-y: scroll;
    overscroll-behavior: contain;
    
    font-family: Rubik, sans-serif;
  }

  @font-face {
    font-family: sans-serif;
    src: local("sans-serif");
    letter-spacing: 0.6px;
    word-spacing: -1.65px;
  }
`;

function App() {
  // Loading auth and locale are different,
  // on locale, it's fine to keep current view since it doesn't effect functionality
  // on auth, it effects functionality so hide the view
  const loading = useAppStore((state) => state.loading);
  const queryAuth = useUserStore((state) => state.queryAuth);

  const {
    offlineReady: [_offlineReady, _setOfflineReady],
    needRefresh: [needRefresh, _setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "theme",
    defaultValue: "light",
    getInitialValueInEffect: false,
    serialize: (value) => value,
    deserialize: (value) => value as ColorScheme,
  });

  const toggleColorScheme = (value?: ColorScheme) => {
    const scheme = value || (colorScheme === "dark" ? "light" : "dark");
    const color = scheme === "light" ? "#ffffff" : "#1A1B1E";
    document.documentElement.style.backgroundColor = color;
    const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (themeColor) themeColor.content = color;
    setColorScheme(scheme);
  }

  useEffect(() => { queryAuth() }, []);

  return (
    <>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{ ...theme, colorScheme }} withNormalizeCSS withGlobalStyles>
          <Suspense fallback={<CenterLoader />}>
            {(loading.auth || loading.locale) && <OverlayLoader full={true} />}
            {!loading.auth && <Outlet />}
            {needRefresh && <UpdateSW updateSW={updateServiceWorker} />}
          </Suspense>
        </MantineProvider>
      </ColorSchemeProvider>
      <Global styles={global} />
    </>
  );
}

export default App;
