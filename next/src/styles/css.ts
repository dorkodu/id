import { CSSObject, ThemeIconProps } from "@mantine/core";

export const widthLimit = { width: "100%", maxWidth: "360px", margin: "0 auto" } satisfies CSSObject
export const fullWidth = { width: "100%" } satisfies CSSObject
export const wrapContent = { whiteSpace: "pre-wrap", wordBreak: "break-word" } satisfies CSSObject

export const themeIcon: Partial<ThemeIconProps> = {
  variant: "light",
  size: 32,
  radius: "md",
}

export const emoji = {
  height: "1em",
  width: "1em",
  margin: "0 .05em 0 .1em",
  verticalAlign: "-0.1em"
} satisfies CSSObject