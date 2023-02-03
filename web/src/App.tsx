import { css, Global } from "@emotion/react";
import { ColorSchemeProvider, LoadingOverlay, MantineProvider } from "@mantine/core";
import { Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppStore } from "./stores/appStore";
import { useUserStore } from "./stores/userStore";
import theme from "./styles/theme";
import RubikRegular from "@assets/fonts/Rubik-Regular.woff2";

const width = css`
  max-width: 768px;
  margin: 0 auto;
`;

const global = css`
  body {
    ${width}
    overflow-y: scroll;
  }
  
  @font-face {
    font-family: Rubik;
    src: url(${RubikRegular}) format("woff2");
  }
`;

function App() {
  const loading = useAppStore((state) => state.getLoading());
  const queryAuth = useUserStore((state) => state.queryAuth);
  useEffect(() => { queryAuth() }, []);

  const colorScheme = useAppStore((state) => state.colorScheme);
  const toggleColorScheme = useAppStore((state) => state.toggleColorScheme);

  return (
    <>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{ ...theme, colorScheme }} withNormalizeCSS withGlobalStyles>
          <Suspense>
            <LoadingOverlay visible={loading} overlayBlur={2} css={css`position: fixed;`} />
            <Outlet />
          </Suspense>
        </MantineProvider>
      </ColorSchemeProvider>
      <Global styles={global} />
    </>
  );
}

export default App;
