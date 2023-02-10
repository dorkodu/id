import { Alert, Anchor, Button, Card, Flex, PasswordInput, Text, Title } from "@mantine/core";
import { IconAlertCircle, IconArrowLeft, IconAsterisk, IconCircleCheck, IconEye, IconEyeOff } from "@tabler/icons";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUserStore } from "../stores/userStore";
import { widthLimit } from "../styles/css";
import { useTranslation } from "react-i18next";
import OverlayLoader from "../components/cards/OverlayLoader";
import { useWait } from "../components/hooks";

interface State {
  loading: boolean;
  status: boolean | undefined;

  password: string;
  token: string;
}

function ConfirmChangePassword() {
  const [searchParams] = useSearchParams();

  const [state, setState] = useState<State>({
    loading: false,
    status: undefined,
    password: "",
    token: searchParams.get("token") ?? ""
  });

  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryConfirmPasswordChange = useUserStore(state => state.queryConfirmPasswordChange);
  const goBack = () => navigate("/dashboard");

  const confirmChangePassword = async () => {
    if (state.loading) return;

    setState({ ...state, loading: true });
    const status = await useWait(() => queryConfirmPasswordChange(state.password, state.token))();
    setState({ ...state, loading: false, status: status });
  }

  return (
    <Flex direction="column" gap="md">
      <Header />

      <Title order={2} align="center">
        {t("route.confirmPasswordChange.title")}
      </Title>
      <Text color="dimmed" size="md" align="center" weight={500}>
        {t("route.confirmPasswordChange.description")}
      </Text>

      <Flex justify="center">
        <Card shadow="sm" p="lg" m="md" radius="md" withBorder css={widthLimit}>
          {state.loading && <OverlayLoader />}

          <Flex direction="column" gap="md">
            <PasswordInput
              label={t("newPassword")}
              placeholder={t("enterNewPassword")}
              description={t("passwordDescription")}
              defaultValue={state.password}
              onChange={(ev) => { setState({ ...state, password: ev.target.value }) }}
              visibilityToggleIcon={({ reveal, size }) =>
                reveal ?
                  <IconEyeOff size={size} stroke={2.5} /> :
                  <IconEye size={size} stroke={2.5} />
              }
              variant="filled"
              aria-required
              icon={<IconAsterisk size={16} />}
            />

            <Flex align="center" justify="space-between">
              <Anchor size={15} onClick={goBack}>
                <Flex align="center" gap="xs">
                  <IconArrowLeft size={16} stroke={2.5} />
                  <Text>{t("goBack")}</Text>
                </Flex>
              </Anchor>

              <Button onClick={confirmChangePassword} radius="md">
                {t("changePassword")}
              </Button>
            </Flex>

            {state.status === true &&
              <Alert
                icon={<IconCircleCheck size={24} />}
                title={t("success.text")}
                color="green"
                variant="light"
              >
                {t("success.passwordChanged")}
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
  )
}

export default ConfirmChangePassword