import { useState } from "react";
import { useUserStore } from "../stores/userStore";

import { Title, Text, TextInput, Button, Anchor, Alert, Card, Flex } from "@mantine/core";
import { IconAlertCircle, IconArrowLeft, IconInfoCircle } from "@tabler/icons";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { fullWidth, widthLimit } from "../styles/css";
import { useTranslation } from "react-i18next";
import { useWait } from "../components/hooks";
import OverlayLoader from "../components/cards/OverlayLoader";
import { getHotkeyHandler } from "@mantine/hooks";

interface State {
  loading: boolean;
  status: boolean | undefined;

  username: string;
  email: string;
}

function ChangePassword() {
  const user = useUserStore((state) => state.user);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryInitiatePasswordChange = useUserStore((state) => state.queryInitiatePasswordChange);

  const [state, setState] = useState<State>({
    loading: false,
    status: undefined,
    username: user?.username ?? "",
    email: user?.email ?? "",
  });

  const goBack = () => navigate(-1);

  const initiateChangePassword = async () => {
    if (state.loading) return;

    setState({ ...state, loading: true });
    const status = await useWait(() => queryInitiatePasswordChange(state.username, state.email))();
    setState({ ...state, loading: false, status: status });
  };

  return (
    <Flex mx="md">
      <Flex direction="column" gap="md" css={widthLimit}>
        <Header />

        <Title order={2} align="center">
          {t("route.changePassword.title")}
        </Title>
        <Text color="dimmed" size="md" weight={500} align="center">
          {t("route.changePassword.description")}
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

              <TextInput
                label={t("username")}
                placeholder={t("enterUsername")}
                defaultValue={state.username}
                onChange={(ev) => { setState({ ...state, username: ev.target.value }) }}
                variant="filled"
                onKeyDown={getHotkeyHandler([["Enter", initiateChangePassword]])}
              />

              <TextInput
                label={t("email")}
                placeholder={t("enterEmail")}
                defaultValue={state.email}
                onChange={(ev) => { setState({ ...state, email: ev.target.value }) }}
                variant="filled"
                onKeyDown={getHotkeyHandler([["Enter", initiateChangePassword]])}
              />

              <Button onClick={initiateChangePassword} radius="md">
                {t("continue_")}
              </Button>

              {state.status === true &&
                <Alert
                  icon={<IconInfoCircle size={24} />}
                  title={t("info.text")}
                  color="blue"
                  variant="light"
                >
                  {t("info.changePassword")}
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

export default ChangePassword;
