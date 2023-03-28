import { Anchor, Divider, Flex, Space, Text, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { clickable, widthLimit } from "../../styles/css";
import { ColorToggleSegmented } from "../ColorToggle";
import IDIcon from "@/assets/id.svg";
import LanguagePicker from "../LanguagePicker";

interface Props {
  title: string;
  description: string;
}

export default function PageLayout({ title, description, children }: React.PropsWithChildren<Props>) {
  return (
    <div style={widthLimit}>
      <Flex direction="column" gap="md" mx="md">
        <Header />

        <Title order={1} align="center">
          {title}
        </Title>
        <Text color="dimmed" size="md" align="center" weight={600}>
          {description}
        </Text>

        {children}

        <Footer />
      </Flex>
    </div>
  )
}

function Header() {
  const navigate = useNavigate();

  return (
    <Flex justify="center" mb="-md">
      <img
        src={IDIcon}
        alt="Dorkodu ID"
        width={100}
        height={100}
        onClick={() => navigate("/welcome")}
        style={clickable}
      />
    </Flex>
  )
}

function Footer() {
  const { t } = useTranslation();

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

        <LanguagePicker />

        <ColorToggleSegmented />
      </Flex>

      <Space h="xs" />
    </Flex>
  )
}