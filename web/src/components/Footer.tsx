import { Anchor, Divider, Flex, NativeSelect, Text } from "@mantine/core";
import { IconWorld } from "@tabler/icons";
import i18n from "../lib/i18n";
import { widthLimit } from "../styles/css";
import { ColorToggleSegmented } from "./ColorToggle";
import { useAppStore } from "../stores/appStore";

function Footer() {
  const changeLocale = useAppStore(state => state.changeLocale);

  const links = [
    { link: "https://dorkodu.com", label: "About", },
    { link: "https://dorkodu.com/privacy", label: "Privacy", },
    { link: "https://garden.dorkodu.com", label: "Garden", },
    { link: "https://dorkodu.com/work", label: "Work", },
  ];

  const items = links.map((link) => (
    <Anchor color="dimmed" key={link.label} href={link.link} size="sm">
      {link.label}
    </Anchor>
  ));

  return (
    <Flex direction="column" align="center" gap="xs">
      <Divider css={widthLimit} />

      <Flex gap="xs">{items}</Flex>

      <Text color="dimmed" weight={450}>
        <b>Dorkodu</b> &copy; {new Date().getFullYear()}
      </Text>

      <NativeSelect
        radius="md"
        variant="default"
        placeholder="language..."
        icon={<IconWorld />}
        value={i18n.language}
        onChange={(ev) => changeLocale(ev.currentTarget.value)}
        data={[
          { value: 'en', label: 'English' },
          { value: 'tr', label: 'Türkçe' },
        ]}
      />

      <ColorToggleSegmented />
    </Flex>
  )
}

export default Footer