import {
  Anchor,
  Button,
  Card,
  Flex,
  Loader,
  LoadingOverlay,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconArrowLeft, IconArrowRight, IconEye, IconEyeOff } from "@tabler/icons";
import { useEffect, useReducer } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUserStore } from "../stores/userStore";
import { widthLimit } from "../styles/css";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../stores/appStore";
import CardAlert from "../components/cards/CardAlert";

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

  const [state, setState] = useReducer((prev: State, next: State) => {
    const newState = { ...prev, ...next };

    if (newState.info.length > 320)
      newState.info = newState.info.substring(0, 320);

    return newState;
  }, {
    loading: false,
    status: undefined,
    info: "",
    password: "",
    token: searchParams.get("token"),
    stage: searchParams.get("token") ? "verify" : "login"
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

    setState({ ...state, loading: true, status: undefined });
    const status = await queryLogin(state.info, state.password);
    setState({ ...state, loading: false, status: status });

    if (status !== "ok") return;

    const redirect = useAppStore.getState().redirect;
    if (!redirect) navigate("/dashboard");
    else navigate(redirect);
  }

  const verifyLogin = async () => {
    if (state.loading) return;
    if (state.token === null) return;

    setState({ ...state, loading: true, status: undefined });
    const status = await queryVerifyLogin(state.token);
    setState({ ...state, loading: false, status: status ? "ok" : "error" });
  }

  const loginStage = () => {
    return (
      <>
        <TextInput
          variant="filled"
          type="text"
          label={t("usernameOrEmail")}
          placeholder={t("enterUsernameOrEmail")}
          defaultValue={state.info}
          onChange={(ev) => { setState({ ...state, info: ev.target.value }) }}
          withAsterisk={true}
          required
        />

        <PasswordInput
          variant="filled"
          label={t("password")}
          placeholder={t("enterPassword")}
          visibilityToggleIcon={({ reveal, size }) =>
            reveal ?
              <IconEyeOff size={size} stroke={2.5} /> :
              <IconEye size={size} stroke={2.5} />
          }
          defaultValue={state.password}
          onChange={(ev) => { setState({ ...state, password: ev.target.value }) }}
          withAsterisk={true}
          required
        />

        <Flex align="center" justify="space-between">
          <Anchor size={15} onClick={goBack}>
            <Flex align="center" gap="xs">
              <IconArrowLeft size={16} stroke={2.5} />
              <Text>{t("goBack")}</Text>
            </Flex>
          </Anchor>

          <Button onClick={login} radius="md">
            {t("login")}
          </Button>
        </Flex>

        {state.status === "verify" &&
          <CardAlert
            title={t("info.text")}
            content={t("info.newLocation")}
            type="info"
          />
        }

        {state.status === "error" &&
          <CardAlert
            title={t("error.text")}
            content={t("error.default")}
            type="error"
          />
        }
      </>
    )
  }

  const verifyLoginStage = () => {
    return (
      <>
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

        {state.status === "ok" &&
          <CardAlert
            title={t("success.text")}
            content={t("success.locationVerified")}
            type="success"
          />
        }

        {state.status === "error" &&
          <CardAlert
            title={t("error.text")}
            content={t("error.default")}
            type="error"
          />
        }
      </>
    )
  }

  useEffect(() => { state.stage === "verify" && verifyLogin() }, []);

  return (
    <Flex direction="column" gap="md">
      <Header />

      <Title order={2} align="center">
        {t("route.login.title")}
      </Title>
      <Text color="dimmed" size="md" align="center" weight={500}>
        {t("route.login.description")}
      </Text>

      <Flex justify="center">
        <Card shadow="sm" p="lg" m="md" radius="md" withBorder css={widthLimit}>
          <LoadingOverlay visible={state.loading} overlayBlur={2} />

          <Flex direction="column" gap="md">
            {/*Use Component() instead of <Component /> to avoid state-loss*/}
            {state.stage === "login" && loginStage()}
            {state.stage === "verify" && verifyLoginStage()}
          </Flex>
        </Card>
      </Flex>

      {state.stage !== "verify" &&
        <>
          <Flex direction="column" align="center" gap="md">
            <Anchor color="blue" size={15} onClick={gotoChangePassword}>
              {t("forgotYourPassword")}
            </Anchor>
          </Flex>

          <Flex direction="column" align="center">
            <Text size={15}>{t("dontHaveAnAccount")}</Text>

            <Anchor color="blue" size={15} onClick={gotoSignup}>
              <Flex align="center" gap="xs">
                <Text>{t("createAccount")}</Text>
                <IconArrowRight size={16} stroke={2.5} />
              </Flex>
            </Anchor>
          </Flex>
        </>
      }

      <Footer />
    </Flex>
  )
}

export default Login;
