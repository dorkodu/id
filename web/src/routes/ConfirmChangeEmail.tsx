import { Alert, Anchor, Card, Flex, Text, Title } from "@mantine/core";
import { IconAlertCircle, IconArrowLeft, IconCircleCheck } from "@tabler/icons";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUserStore } from "../stores/userStore";
import { fullWidth, widthLimit } from "../styles/css";
import { useTranslation } from "react-i18next";
import { useWait } from "../components/hooks";
import Loader from "../components/cards/Loader";

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
    <Flex mx="md">
      <Flex direction="column" gap="md" css={widthLimit}>
        <Header />

        <Title order={2} align="center">
          {t("route.confirmEmailChange.title")}
        </Title>
        <Text color="dimmed" size="md" align="center" weight={500}>
          {t("route.confirmEmailChange.description")}
        </Text>

        <Flex justify="center">
          <Card shadow="sm" p="md" radius="md" withBorder css={fullWidth}>
            <Flex direction="column" gap="md">
              {state.loading && <Flex justify="center"><Loader /></Flex>}

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
        </Flex>

        <Footer />
      </Flex>
    </Flex>
  )
}

export default ConfirmChangeEmail