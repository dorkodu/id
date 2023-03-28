import { Anchor, Flex, Text, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { widthLimit } from "../styles/css";

function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const goBack = () => navigate("/dashboard");

  return (
    <Flex mx="md">
      <Flex direction="column" gap="md" sx={widthLimit}>
        <Header />

        <Title order={2} align="center">
          {t("route.404.title")}
        </Title>
        <Text color="dimmed" size="md" align="center" weight={500}>
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
    </Flex>
  )
}

export default NotFound