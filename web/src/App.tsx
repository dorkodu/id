import { css, Global } from "@emotion/react";
import { ColorScheme, ColorSchemeProvider, LoadingOverlay, MantineProvider } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
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
    overscroll-behavior: contain;
  }
`;

function App() {
  // Loading auth and locale are different,
  // on locale, it's fine to keep current view since it doesn't effect functionality
  // on auth, it effects functionality so hide the view
  const loading = useAppStore((state) => state.loading);
  const queryAuth = useUserStore((state) => state.queryAuth);
  useEffect(() => { queryAuth() }, []);

  //const colorScheme = useAppStore((state) => state.colorScheme);
  //const toggleColorScheme = useAppStore((state) => state.toggleColorScheme);

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "theme",
    defaultValue: "light",
    getInitialValueInEffect: true,
    deserialize: (value) => {
      value = JSON.parse(value);
      const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
      if (themeColor) themeColor.content = value === "light" ? "#ffffff" : "#1A1B1E";
      return value as ColorScheme;
    },
    serialize: (value) => {
      const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
      if (themeColor) themeColor.content = value === "light" ? "#ffffff" : "#1A1B1E";
      return JSON.stringify(value);
    }
  });

  const toggleColorScheme = (value?: ColorScheme) => {
    const scheme = value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(scheme);
  }

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
