import { CSSObject, ThemeIconProps } from "@mantine/core";

export const widthLimit = { width: "100%", maxWidth: "360px", margin: "0 auto" } satisfies CSSObject
export const fullWidth = { width: "100%" } satisfies CSSObject

export const themeIcon: Partial<ThemeIconProps> = {
  variant: "light",
  size: 32,
  radius: "md",
}