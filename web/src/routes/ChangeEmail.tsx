import { Alert, Anchor, Button, Card, Flex, Text, TextInput } from "@mantine/core";
import { IconAlertCircle, IconArrowLeft, IconAt, IconInfoCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/userStore";
import { fullWidth } from "../styles/css";
import { useTranslation } from "react-i18next";
import { useWait } from "../components/hooks";
import OverlayLoader from "../components/loaders/OverlayLoader";
import InputRequirements, { getRequirement, getRequirementError } from "../components/popovers/InputRequirements";
import { getHotkeyHandler, useFocusWithin } from "@mantine/hooks";
import PageLayout from "@/components/layouts/PageLayout";

interface State {
  loading: boolean;
  status: boolean | undefined;

  email: string;
}

function ChangeEmail() {
  const [state, setState] = useState<State>({ loading: false, status: undefined, email: "" });

  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryInitiateEmailChange = useUserStore(state => state.queryInitiateEmailChange);

  const goBack = () => navigate(-1);

  const initiateEmailChange = async () => {
    if (state.loading) return;

    setState({ ...state, loading: true });
    const status = await useWait(() => queryInitiateEmailChange(state.email))();
    setState({ ...state, loading: false, status: status });
  }

  // Necessary stuff for input validation & error messages
  const [inputReady, setInputReady] = useState(false);
  const { ref, focused } = useFocusWithin();
  useEffect(() => { setInputReady(focused || inputReady) }, [focused]);

  return (
    <PageLayout
      title={t("route.changeEmail.title")}
      description={t("route.changeEmail.description")}
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
            value={state.email}
            requirements={getRequirement(t, "email")}
          >
            <TextInput
              label={t("newEmail")}
              placeholder={t("enterNewEmail")}
              defaultValue={state.email}
              onChange={(ev) => { setState({ ...state, email: ev.target.value }) }}
              radius="md"
              variant="filled"
              icon={<IconAt size={16} />}
              type={"email"}
              error={inputReady && getRequirementError(t, "email", state.email, focused)}
              ref={ref}
              onKeyDown={getHotkeyHandler([["Enter", initiateEmailChange]])}
            />
          </InputRequirements>

          <Button onClick={initiateEmailChange} radius="md">
            {t("continue_")}
          </Button>

          {state.status === true &&
            <Alert
              icon={<IconInfoCircle size={24} />}
              title={t("info.text")}
              color="blue"
              variant="light"
            >
              {t("info.changeEmail")}
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

export default ChangeEmail