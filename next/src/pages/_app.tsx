import type { AppProps } from 'next/app'
import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core"
import { useLocalStorage } from '@mantine/hooks';

export default function App({ Component, pageProps }: AppProps) {
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

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <Component {...pageProps} />
      </MantineProvider>
    </ColorSchemeProvider>
  )
}
