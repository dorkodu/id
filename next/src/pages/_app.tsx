import type { AppProps } from 'next/app'
import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core"
import { useLocalStorage } from '@mantine/hooks';
import { theme } from '@/styles/theme';
import { emotionCache } from '@/styles/cache';
import Script from 'next/script';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "theme",
    defaultValue: "light",
    getInitialValueInEffect: true,
    serialize: (value) => value,
    deserialize: (value) => value as ColorScheme,
  });

  const toggleColorScheme = (value?: ColorScheme) => {
    if (typeof window !== "undefined") {
      const scheme = value || (colorScheme === "dark" ? "light" : "dark");
      const color = scheme === "light" ? "#ffffff" : "#1A1B1E";
      document.documentElement.style.backgroundColor = color;
      const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
      if (themeColor) themeColor.content = color;
      setColorScheme(scheme);
    }
  }

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider emotionCache={emotionCache} theme={{ ...theme, colorScheme }} withGlobalStyles withNormalizeCSS>

        <Head>
          <meta name="theme-color" content="#ffffff" />
        </Head>

        <Script id="theme" strategy="beforeInteractive">
          {`let theme=localStorage.getItem("theme");"light"!==theme&&"dark"!==theme&&(theme="light",localStorage.setItem("theme","light"));let color="light"===theme?"#ffffff":"#1A1B1E";document.documentElement.style.backgroundColor=color,document.querySelector('meta[name="theme-color"]').setAttribute("content",color);`}
        </Script>

        <Component {...pageProps} />

      </MantineProvider>
    </ColorSchemeProvider>
  )
}
