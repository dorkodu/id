import { Alert, Anchor, Button, Card, Flex, Text, TextInput, Title } from "@mantine/core";
import { IconAlertCircle, IconArrowLeft, IconAt, IconInfoCircle } from "@tabler/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUserStore } from "../stores/userStore";
import { widthLimit } from "../styles/css";
import { useTranslation } from "react-i18next";
import { useWait } from "../components/hooks";
import OverlayLoader from "../components/cards/OverlayLoader";
import InputRequirements, { getRequirement, getRequirementError } from "../components/popovers/InputRequirements";
import { getHotkeyHandler, useFocusWithin } from "@mantine/hooks";

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
    <Flex direction="column" gap="md">
      <Header />

      <Title order={2} align="center">
        {t("route.changeEmail.title")}
      </Title>
      <Text color="dimmed" size="md" align="center" weight={500}>
        {t("route.changeEmail.description")}
      </Text>

      <Flex justify="center">
        <Card shadow="sm" p="lg" m="md" radius="md" withBorder css={widthLimit}>
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
                required
                icon={<IconAt size={16} />}
                type={"email"}
                error={inputReady && !focused && getRequirementError(t, "email", state.email)}
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
      </Flex>

      <Footer />
    </Flex>
  )
}

export default ChangeEmail