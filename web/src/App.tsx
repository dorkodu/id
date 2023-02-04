import { css, Global } from "@emotion/react";
import { ColorSchemeProvider, LoadingOverlay, MantineProvider } from "@mantine/core";
import { Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppStore } from "./stores/appStore";
import { useUserStore } from "./stores/userStore";
import theme from "./styles/theme";

const width = css`
  max-width: 768px;
  margin: 0 auto;
`;

const global = css`
  body {
    ${width}
    overflow-y: scroll;
  }
`;

function App() {
  // Loading auth and locale are different,
  // on locale, it's fine to keep current view since it doesn't effect functionality
  // on auth, it effects functionality so hide the view
  const loading = useAppStore((state) => state.loading);
  const queryAuth = useUserStore((state) => state.queryAuth);
  useEffect(() => { queryAuth() }, []);

  const colorScheme = useAppStore((state) => state.colorScheme);
  const toggleColorScheme = useAppStore((state) => state.toggleColorScheme);

  return (
    <>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{ ...theme, colorScheme }} withNormalizeCSS withGlobalStyles>
          <Suspense>
            <LoadingOverlay
              visible={loading.auth || loading.locale}
              overlayBlur={2}
              css={css`position: fixed;`}
            />
            {!loading.auth && <Outlet />}
          </Suspense>
        </MantineProvider>
      </ColorSchemeProvider>
      <Global styles={global} />
    </>
  );
}

export default App;
