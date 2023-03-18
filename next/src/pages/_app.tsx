import type { AppContext, AppInitialProps, AppProps } from 'next/app'
import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core"
import { theme } from '@/styles/theme';
import { emotionCache } from '@/styles/cache';
import Head from 'next/head';
import { useState } from 'react';
import App from 'next/app';
import { getCookie, setCookie } from 'cookies-next';
import Script from 'next/script';

type CustomAppProps = { theme: ColorScheme }

export function CustomApp(props: AppProps & CustomAppProps) {
  const { Component, pageProps } = props;

  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.theme);
  const toggleColorScheme = (value?: ColorScheme) => {
    const scheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    const color = scheme === "light" ? "#fff" : "#1A1B1E";
    document.documentElement.style.backgroundColor = color;
    const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (themeColor) themeColor.content = color;

    setColorScheme(scheme);
    setCookie('theme', scheme, { maxAge: 60 * 60 * 24 * 365 });
  }

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider emotionCache={emotionCache} theme={{ ...theme, colorScheme }} withGlobalStyles withNormalizeCSS>

        <Head>
          <meta name="theme-color" content="#ffffff" />
        </Head>

        <Script id="theme" strategy="beforeInteractive">
          {'let a=`; ${document.cookie}`.split("; theme=");let b=a.length===2&&a.pop().split(";").shift();let c=b==="dark"?"#1A1B1E":"#fff";document.documentElement.style.backgroundColor=c'}
        </Script>

        <Component {...pageProps} />

      </MantineProvider>
    </ColorSchemeProvider>
  )
}

CustomApp.getInitialProps = async (context: AppContext): Promise<CustomAppProps & AppInitialProps> => {
  const ctx = await App.getInitialProps(context);

  let theme = getCookie("theme", context.ctx) as ColorScheme;
  if (theme !== "light" && theme !== "dark") theme = "light";

  return { ...ctx, theme }
}

export default CustomApp