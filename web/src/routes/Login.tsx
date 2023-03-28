import {
  Alert,
  Anchor,
  Button,
  Card,
  Flex,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconAlertCircle, IconArrowLeft, IconCircleCheck, IconInfoCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUserStore } from "../stores/userStore";
import { fullWidth, widthLimit } from "../styles/css";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../stores/appStore";
import OverlayLoader from "../components/loaders/OverlayLoader";
import { useWait } from "../components/hooks";
import { getHotkeyHandler } from "@mantine/hooks";
import VisibilityToggle from "../components/VisibilityToggle";

interface State {
  loading: boolean;
  status: undefined | "verify" | "error" | "ok";

  info: string;
  password: string;
  token: string | null;

  stage: "login" | "verify";
}

function Login() {
  const [searchParams] = useSearchParams();

  const [state, setState] = useState<State>({
    loading: false,
    status: undefined,
    info: "",
    password: "",
    token: searchParams.get("token"),
    stage: searchParams.get("token") ? "verify" : "login",
  });

  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryLogin = useUserStore((state) => state.queryLogin);
  const queryVerifyLogin = useUserStore((state) => state.queryVerifyLogin);

  const gotoChangePassword = () => navigate("/change-password");
  const gotoSignup = () => navigate("/create-account");
  const goBack = () => navigate("/welcome");

  const login = async () => {
    if (state.loading) return;

    setState({ ...state, loading: true });
    const status = await useWait(() => queryLogin(state.info, state.password))();
    setState({ ...state, loading: false, status: status });

    if (status !== "ok") return;

    const redirect = useAppStore.getState().redirect;
    if (!redirect) navigate("/dashboard");
    else navigate(redirect);
  }

  const verifyLogin = async () => {
    if (state.loading) return;

    setState({ ...state, loading: true });
    const status = await useWait(() => queryVerifyLogin(state.token))();
    setState({ ...state, loading: false, status: status ? "ok" : "error" });
  }

  const loginStage = () => {
    return (
      <>
        <Flex>
          <Anchor size={15} onClick={goBack}>
            <Flex align="center" gap="xs">
              <IconArrowLeft size={16} stroke={2.5} />
              <Text>{t("goBack")}</Text>
            </Flex>
          </Anchor>
        </Flex>

        <TextInput
          variant="filled"
          type="text"
          label={t("usernameOrEmail")}
          placeholder={t("enterUsernameOrEmail")}
          defaultValue={state.info}
          onChange={(ev) => { setState({ ...state, info: ev.target.value }) }}
          withAsterisk={true}
          onKeyDown={getHotkeyHandler([["Enter", login]])}
        />

        <PasswordInput
          variant="filled"
          label={t("password")}
          placeholder={t("enterPassword")}
          visibilityToggleIcon={VisibilityToggle}
          defaultValue={state.password}
          onChange={(ev) => { setState({ ...state, password: ev.target.value }) }}
          withAsterisk={true}
          onKeyDown={getHotkeyHandler([["Enter", login]])}
        />

        <Button onClick={login} radius="md">
          {t("login")}
        </Button>

        {state.status === "verify" &&
          <Alert
            icon={<IconInfoCircle size={24} />}
            title={t("info.text")}
            color="blue"
            variant="light"
          >
            {t("info.newLocation")}
          </Alert>
        }

        {state.status === "error" &&
          <Alert
            icon={<IconAlertCircle size={24} />}
            title={t("error.text")}
            color="red"
            variant="light"
          >
            {t("error.default")}
          </Alert>
        }
      </>
    )
  }

  const verifyLoginStage = () => {
    return (
      <>
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

        {state.status === "ok" &&
          <Alert
            icon={<IconCircleCheck size={24} />}
            title={t("success.text")}
            color="green"
            variant="light"
          >
            {t("success.locationVerified")}
          </Alert>
        }

        {state.status === "error" &&
          <Alert
            icon={<IconAlertCircle size={24} />}
            title={t("error.text")}
            color="red"
            variant="light"
          >
            {t("error.default")}
          </Alert>
        }
      </>
    )
  }

  useEffect(() => { state.stage === "verify" && verifyLogin() }, []);

  return (
    <Flex mx="md">
      <Flex direction="column" gap="md" sx={widthLimit}>
        <Header />

        <Title order={2} align="center">
          {t("route.login.title")}
        </Title>
        <Text color="dimmed" size="md" align="center" weight={500}>
          {t("route.login.description")}
        </Text>

        <Flex justify="center">
          <Card shadow="sm" p="md" radius="md" withBorder sx={fullWidth}>
            {state.loading && <OverlayLoader />}

            <Flex direction="column" gap="md">
              {/*Use Component() instead of <Component /> to avoid state-loss*/}
              {state.stage === "login" && loginStage()}
              {state.stage === "verify" && verifyLoginStage()}
            </Flex>
          </Card>
        </Flex>

        {state.stage !== "verify" &&
          <>
            <Anchor color="blue" align="center" onClick={gotoSignup}>
              {t("dontHaveAnAccount")}
            </Anchor>

            <Anchor color="blue" align="center" onClick={gotoChangePassword}>
              {t("forgotYourPassword")}
            </Anchor>
          </>
        }

        <Footer />
      </Flex>
    </Flex>
  )
}

export default Login;
