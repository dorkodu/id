import { CSSObject, ThemeIconProps } from "@mantine/core";

export const widthLimit: CSSObject = { width: "100%", maxWidth: "360px", margin: "0 auto" }
export const fullWidth: CSSObject = { width: "100%" }

export const themeIcon: Partial<ThemeIconProps> = {
  variant: "light",
  size: 32,
  radius: "md",
}