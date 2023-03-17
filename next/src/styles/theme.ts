import { MantineThemeOverride } from "@mantine/core";
import localFont from 'next/font/local'

const fontRubik = localFont({ src: '../assets/fonts/Rubik.woff2' });

export const theme: MantineThemeOverride = {
  dir: "ltr",
  respectReducedMotion: true,

  primaryColor: "green",
  defaultRadius: "md",
  cursorType: "pointer",
  focusRing: "auto",
  loader: "dots",

  fontFamily: `${fontRubik.style.fontFamily}, Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, sans-serif`,
  fontFamilyMonospace: `ui-monospace, "JetBrains Mono", "Cascadia Mono", SFMono-Regular, "Segoe UI Mono", "Roboto Mono", Liberation Mono, Courier New, "Ubuntu Mono",  Menlo, Monaco, Consolas, monospace`,
}