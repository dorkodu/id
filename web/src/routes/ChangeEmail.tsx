import { Alert, Anchor, Button, Card, Flex, LoadingOverlay, Text, TextInput, Title } from "@mantine/core";
import { IconAlertCircle, IconArrowLeft, IconAt, IconInfoCircle } from "@tabler/icons";
import { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUserStore } from "../stores/userStore";
import { widthLimit } from "../styles/css";
import { useTranslation } from "react-i18next";

interface State {
  loading: boolean;
  status: boolean | undefined;

  email: string;
}

function ChangeEmail() {
  const [state, setState] = useReducer((prev: State, next: State) => {
    const newState = { ...prev, ...next };

    if (newState.email.length > 320)
      newState.email = newState.email.substring(0, 320);

    return newState;
  }, { loading: false, status: undefined, email: "" });

  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryInitiateEmailChange = useUserStore(state => state.queryInitiateEmailChange);

  const goBack = () => navigate(-1);

  const initiateEmailChange = async () => {
    if (state.loading) return;

    setState({ ...state, loading: true, status: undefined });
    const status = await queryInitiateEmailChange(state.email);
    setState({ ...state, loading: false, status: status });
  }

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
          <LoadingOverlay visible={state.loading} overlayBlur={2} />

          <Flex direction="column" gap="md">
            <TextInput
              label={t("newEmail")}
              placeholder={t("enterNewEmail")}
              description={t("emailDescription")}
              defaultValue={state.email}
              onChange={(ev) => { setState({ ...state, email: ev.target.value }) }}
              radius="md"
              variant="filled"
              required
              icon={<IconAt size={16} />}
              type={"email"}
            />

            <Flex align="center" justify="space-between">
              <Anchor size={15} onClick={goBack}>
                <Flex align="center" gap="xs">
                  <IconArrowLeft size={16} stroke={2.5} />
                  <Text>{t("goBack")}</Text>
                </Flex>
              </Anchor>

              <Button onClick={initiateEmailChange} radius="md">
                {t("continue_")}
              </Button>
            </Flex>

            {state.status === true &&
              <Alert
                icon={<IconInfoCircle size={24} />}
                title="Info"
                color="blue"
                variant="light"
              >
                {t("info.changeEmail")}
              </Alert>
            }

            {state.status === false &&
              <Alert
                icon={<IconAlertCircle size={24} />}
                title="Info"
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