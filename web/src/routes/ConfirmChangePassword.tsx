import { Alert, Anchor, Button, Card, Flex, PasswordInput, Text, Title } from "@mantine/core";
import { IconAlertCircle, IconArrowLeft, IconAsterisk, IconCircleCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUserStore } from "../stores/userStore";
import { fullWidth, widthLimit } from "../styles/css";
import { useTranslation } from "react-i18next";
import OverlayLoader from "../components/cards/OverlayLoader";
import { useWait } from "../components/hooks";
import { getHotkeyHandler, useFocusWithin } from "@mantine/hooks";
import InputRequirements, { getRequirement, getRequirementError } from "../components/popovers/InputRequirements";
import { VisibilityToggleIcon } from "../components/util";

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

  // Necessary stuff for input validation & error messages
  const [inputReady, setInputReady] = useState(false);
  const { ref, focused } = useFocusWithin();
  useEffect(() => { setInputReady(focused || inputReady) }, [focused]);

  return (
    <Flex mx="md">
      <Flex direction="column" gap="md" css={widthLimit}>
        <Header />

        <Title order={2} align="center">
          {t("route.confirmPasswordChange.title")}
        </Title>
        <Text color="dimmed" size="md" align="center" weight={500}>
          {t("route.confirmPasswordChange.description")}
        </Text>

        <Flex justify="center">
          <Card shadow="sm" p="md" radius="md" withBorder css={fullWidth}>
            {state.loading && <OverlayLoader />}

            <Flex direction="column" gap="md">
              <Flex>
                <Anchor size={15} onClick={goBack}>
                  <Flex align="center" gap="xs">
                    <IconArrowLeft size={16} stroke={2.5} />
                    <Text>{t("goBack")}</Text>
                  </Flex>
                </Anchor>
              </Flex>

              <InputRequirements
                value={state.password}
                requirements={getRequirement(t, "password")}
              >
                <PasswordInput
                  label={t("newPassword")}
                  placeholder={t("enterNewPassword")}
                  defaultValue={state.password}
                  onChange={(ev) => { setState({ ...state, password: ev.target.value }) }}
                  visibilityToggleIcon={VisibilityToggleIcon}
                  variant="filled"
                  icon={<IconAsterisk size={16} />}
                  error={inputReady && !focused && getRequirementError(t, "password", state.password)}
                  ref={ref}
                  onKeyDown={getHotkeyHandler([["Enter", confirmChangePassword]])}
                />
              </InputRequirements>

              <Button onClick={confirmChangePassword} radius="md">
                {t("changePassword")}
              </Button>

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
    </Flex>
  )
}

export default ConfirmChangePassword