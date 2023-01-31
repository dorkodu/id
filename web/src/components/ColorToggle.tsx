import {
  SegmentedControl,
  Center,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";

import { IconSun, IconMoon, IconMoonStars } from "@tabler/icons";

export function ColorToggleSegmented() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <SegmentedControl
      radius="md"
      value={colorScheme}
      onChange={(value: "light" | "dark") => {
        toggleColorScheme(value);
      }}
      data={[
        {
          value: "light",
          label: (
            <Center>
              <IconSun size={18} stroke={3} />
            </Center>
          ),
        },
        {
          value: "dark",
          label: (
            <Center>
              <IconMoon size={18} stroke={3} />
            </Center>
          ),
        },
      ]}
    />
  );
}

export function ColorToggleActionIcon() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <ActionIcon
      onClick={() => toggleColorScheme()}
      size="lg"
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        color:
          theme.colorScheme === "dark"
            ? theme.colors.yellow[4]
            : theme.colors.blue[6],
      })}>
      {colorScheme === "dark" ? (
        <IconSun size={18} />
      ) : (
        <IconMoonStars size={18} />
      )}
    </ActionIcon>
  );
}
