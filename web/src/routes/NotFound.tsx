import { Anchor, Flex, Text, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const goBack = () => navigate("/dashboard");

  return (
    <Flex direction="column" gap="md">
      <Header />

      <Title order={1} size="h2" align="center">
        {t("route.404.title")}
      </Title>
      <Text color="dimmed" size="md" weight={500} align="center">
        {t("route.404.description")}
      </Text>

      <Flex justify="center">
        <Anchor size={15} onClick={goBack}>
          <Flex align="center" gap="xs">
            <IconArrowLeft size={16} stroke={2.5} />
            <Text>{t("goBack")}</Text>
          </Flex>
        </Anchor>
      </Flex>

      <Footer />
    </Flex>
  )
}

export default NotFound