import { Anchor, Divider, Flex, Space, Text } from "@mantine/core";
import { ColorToggleSegmented } from "./ColorToggle";
import { useTranslation } from "next-i18next";
import { widthLimit } from "@/styles/css";
import LanguagePicker from "./LanguagePicker";
import CustomLink from "./CustomLink";

function Footer() {
  const { t } = useTranslation();

  const links = [
    { link: "https://dorkodu.com", label: t("footer.about"), },
    { link: "https://dorkodu.com/privacy", label: t("footer.privacy"), },
    { link: "https://garden.dorkodu.com", label: t("footer.garden"), },
    { link: "https://dorkodu.com/work", label: t("footer.work"), },
  ];

  const items = links.map((link) => (
    <CustomLink href={link.link} key={link.label}>
      <Anchor color="dimmed" size="sm" component="div">{link.label}</Anchor>
    </CustomLink>
  ));

  return (
    <Flex direction="column">
      <Flex direction="column" align="center" gap="xs">
        <Divider sx={widthLimit} />

        <Flex gap="xs" justify="center" wrap="wrap">{items}</Flex>

        <Text color="dimmed" weight={450}>
          <b>Dorkodu</b> &copy; {new Date().getFullYear()}
        </Text>

        <LanguagePicker />

        <ColorToggleSegmented />
      </Flex>

      <Space h="xs" />
    </Flex>
  )
}

export default Footer