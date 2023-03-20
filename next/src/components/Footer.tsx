import { Anchor, Divider, Flex, NativeSelect, Space, Text } from "@mantine/core";
import { IconWorld } from "@tabler/icons-react";
import { ColorToggleSegmented } from "./ColorToggle";
import { useAppStore } from "../stores/appStore";
import { useTranslation } from "next-i18next";
import { widthLimit } from "@/styles/css";

function Footer() {
  const { t } = useTranslation();
  const changeLocale = useAppStore(state => state.changeLocale);

  const links = [
    { link: "https://dorkodu.com", label: t("footer.about"), },
    { link: "https://dorkodu.com/privacy", label: t("footer.privacy"), },
    { link: "https://garden.dorkodu.com", label: t("footer.garden"), },
    { link: "https://dorkodu.com/work", label: t("footer.work"), },
  ];

  const items = links.map((link) => (
    <Anchor color="dimmed" key={link.label} href={link.link} size="sm">
      {link.label}
    </Anchor>
  ));

  return (
    <Flex direction="column">
      <Flex direction="column" align="center" gap="xs">
        <Divider sx={widthLimit} />

        <Flex gap="xs" justify="center" wrap="wrap">{items}</Flex>

        <Text color="dimmed" weight={450}>
          <b>Dorkodu</b> &copy; {new Date().getFullYear()}
        </Text>

        <NativeSelect
          radius="md"
          variant="default"
          icon={<IconWorld />}
          //value={i18n.language}
          onChange={(ev) => changeLocale(ev.currentTarget.value)}
          data={[
            { value: 'en', label: 'English' },
            { value: 'tr', label: 'Türkçe' },
          ]}
        />

        <ColorToggleSegmented />
      </Flex>

      <Space h="xs" />
    </Flex>
  )
}

export default Footer