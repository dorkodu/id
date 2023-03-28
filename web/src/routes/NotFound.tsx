import PageLayout from "@/components/layouts/PageLayout";
import { Anchor, Flex, Text } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const goBack = () => navigate("/dashboard");

  return (
    <PageLayout
      title={t("route.404.title")}
      description={t("route.404.description")}
    >
      <Anchor size={15} onClick={goBack}>
        <Flex align="center" gap="xs">
          <IconArrowLeft size={16} stroke={2.5} />
          <Text>{t("goBack")}</Text>
        </Flex>
      </Anchor>
    </PageLayout>
  )
}

export default NotFound