import { theme as PrismTheme } from "@dorkodu/prism";
import { MantineThemeOverride, TextInputProps } from "@mantine/core";

const TextInputDefaultProps: Partial<TextInputProps> = {
  sx: { border: "0 !important" },
};

const theme: MantineThemeOverride = {
  ...PrismTheme,
  components: {
    TextInput: {
      defaultProps: TextInputDefaultProps,
    },
  },
};

export default theme;
