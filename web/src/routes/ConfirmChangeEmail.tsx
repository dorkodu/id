import { Alert, Anchor, Card, Flex, Text } from "@mantine/core";
import { IconAlertCircle, IconArrowLeft, IconCircleCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserStore } from "../stores/userStore";
import { fullWidth } from "../styles/css";
import { useTranslation } from "react-i18next";
import { useWait } from "../components/hooks";
import DefaultLoader from "../components/loaders/DefaultLoader";
import PageLayout from "@/components/layouts/PageLayout";

interface State {
  loading: boolean;
  status: boolean | undefined;

  token: string;
}

function ConfirmChangeEmail() {
  const [searchParams] = useSearchParams();

  const [state, setState] = useState<State>({
    loading: false,
    status: undefined,
    token: searchParams.get("token") ?? ""
  });

  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryConfirmEmailChange = useUserStore(state => state.queryConfirmEmailChange);

  const goBack = () => navigate("/dashboard");

  const confirmEmailChange = async () => {
    if (state.loading) return;

    setState({ ...state, loading: true });
    const status = await useWait(() => queryConfirmEmailChange(state.token))();
    setState({ ...state, loading: false, status: status });
  }

  useEffect(() => { confirmEmailChange() }, []);

  return (
    <PageLayout
      title={t("route.confirmEmailChange.title")}
      description={t("route.confirmEmailChange.description")}
    >
      <Card shadow="sm" p="md" radius="md" withBorder sx={fullWidth}>
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
              {t("success.emailChanged")}
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

export default ConfirmChangeEmail