import { css, Global } from "@emotion/react";
import { ColorSchemeProvider, Loader, MantineProvider } from "@mantine/core";
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

const center = css`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
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
            {loading ? <Loader css={center} variant="dots" color="green" /> : <Outlet />}
          </Suspense>
        </MantineProvider>
      </ColorSchemeProvider>
      <Global styles={global} />
    </>
  );
}

export default App;
