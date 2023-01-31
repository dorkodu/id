import { Alert, Anchor, Card, Flex, Loader, Text, Title } from "@mantine/core";
import { IconAlertCircle, IconArrowLeft, IconCircleCheck } from "@tabler/icons";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUserStore } from "../stores/userStore";
import { widthLimit } from "../styles/css";
import { useTranslation } from "react-i18next";

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

    setState({ ...state, loading: true, status: undefined });
    const status = await queryRevertEmailChange(state.token);
    setState({ ...state, loading: false, status: status });
  }

  useEffect(() => { revertEmailChange() }, []);

  return (
    <Flex direction="column" gap="md">
      <Header />

      <Title order={2} align="center">
        {t("route.signup.title")}
      </Title>
      <Text color="dimmed" size="md" align="center" weight={500}>
        {t("route.signup.description")}
      </Text>

      <Flex justify="center">
        <Card shadow="sm" p="lg" m="md" radius="md" withBorder css={widthLimit}>
          <Flex direction="column" gap="md">
            {state.loading &&
              <Flex justify="center">
                <Loader variant="dots" color="green" />
              </Flex>
            }

            {!state.loading &&
              <Anchor size={15} onClick={goBack}>
                <Flex align="center" gap="xs">
                  <IconArrowLeft size={16} stroke={2.5} />
                  <Text>{t("goBack")}</Text>
                </Flex>
              </Anchor>
            }

            {state.status === true &&
              <Alert
                icon={<IconCircleCheck size={24} />}
                title="Success"
                color="green"
                variant="light"
              >
                {t("success.emailReverted")}
              </Alert>
            }

            {state.status === false &&
              <Alert
                icon={<IconAlertCircle size={24} />}
                title="Error"
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
  )
}

export default RevertChangeEmail