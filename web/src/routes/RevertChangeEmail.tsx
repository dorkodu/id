import { Alert, Anchor, Card, Flex, Text } from "@mantine/core";
import { IconAlertCircle, IconArrowLeft, IconCircleCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserStore } from "../stores/userStore";
import { widthLimit } from "../styles/css";
import { useTranslation } from "react-i18next";
import DefaultLoader from "../components/loaders/DefaultLoader";
import PageLayout from "@/components/layouts/PageLayout";

interface State {
  loading: boolean;
  status: boolean | undefined;

  token: string;
}

function RevertChangeEmail() {
  const [searchParams] = useSearchParams();

  const [state, setState] = useState<State>({
    loading: false,
    status: undefined,
    token: searchParams.get("token") ?? ""
  });

  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryRevertEmailChange = useUserStore(state => state.queryRevertEmailChange);

  const goBack = () => navigate("/dashboard");

  const revertEmailChange = async () => {
    if (state.loading) return;

    setState({ ...state, loading: true });
    const status = await queryRevertEmailChange(state.token);
    setState({ ...state, loading: false, status: status });
  }

  useEffect(() => { revertEmailChange() }, []);

  return (
    <PageLayout
      title={t("route.signup.title")}
      description={t("route.signup.description")}
    >
      <Card shadow="sm" p="md" radius="md" withBorder sx={widthLimit}>
        <Flex direction="column" gap="md">
          {state.loading && <Flex justify="center"><DefaultLoader /></Flex>}

          {!state.loading &&
            <Flex>
              <Anchor size={15} onClick={goBack}>
                <Flex align="center" gap="xs">
                  <IconArrowLeft size={16} stroke={2.5} />
                  <Text>{t("goBack")}</Text>
                </Flex>
              </Anchor>
            </Flex>
          }

          {state.status === true &&
            <Alert
              icon={<IconCircleCheck size={24} />}
              title={t("success.text")}
              color="green"
              variant="light"
            >
              {t("success.emailReverted")}
            </Alert>
          }

          {state.status === false &&
            <Alert
              icon={<IconAlertCircle size={24} />}
              title={t("error.text")}
              color="red"
              variant="light"
            >
              {t("error.default")}
            </Alert>
          }
        </Flex>
      </Card>
    </PageLayout>
  )
}

export default RevertChangeEmail