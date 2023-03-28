import { Alert, Anchor, Button, Card, Flex, PasswordInput, Text } from "@mantine/core";
import { IconAlertCircle, IconArrowLeft, IconAsterisk, IconCircleCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserStore } from "../stores/userStore";
import { fullWidth } from "../styles/css";
import { useTranslation } from "react-i18next";
import OverlayLoader from "../components/loaders/OverlayLoader";
import { useWait } from "../components/hooks";
import { getHotkeyHandler, useFocusWithin } from "@mantine/hooks";
import InputRequirements, { getRequirement, getRequirementError } from "../components/popovers/InputRequirements";
import VisibilityToggle from "../components/VisibilityToggle";
import PageLayout from "@/components/layouts/PageLayout";

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
    <PageLayout
      title={t("route.confirmPasswordChange.title")}
      description={t("route.confirmPasswordChange.description")}
    >
      <Card shadow="sm" p="md" radius="md" withBorder sx={fullWidth}>
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
              visibilityToggleIcon={VisibilityToggle}
              variant="filled"
              icon={<IconAsterisk size={16} />}
              error={inputReady && getRequirementError(t, "password", state.password, focused)}
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
    </PageLayout>
  )
}

export default ConfirmChangePassword