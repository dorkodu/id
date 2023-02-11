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
import {
  IconAlertCircle,
  IconArrowLeft,
  IconArrowRight,
  IconAsterisk,
  IconAt,
  IconEye,
  IconEyeOff,
  IconInfoCircle,
  IconUser,
} from "@tabler/icons";
import { useReducer } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUserStore } from "../stores/userStore";
import { widthLimit } from "../styles/css";
import { Trans, useTranslation } from "react-i18next";
import { useAppStore } from "../stores/appStore";
import { useWait } from "../components/hooks";
import OverlayLoader from "../components/cards/OverlayLoader";

interface State {
  loading: boolean;
  status: undefined | "ok" | "error" | "username" | "email" | "both";

  username: string;
  email: string;
  password: string;
  token: string | null;

  stage: "signup" | "confirm";
}

function CreateAccount() {
  const [searchParams] = useSearchParams();

  const [state, setState] = useReducer((prev: State, next: State) => {
    const newState = { ...prev, ...next };

    if (newState.username.length > 16)
      newState.username = newState.username.substring(0, 16);

    if (newState.email.length > 320)
      newState.email = newState.email.substring(0, 320);

    return newState;
  }, {
    loading: false,
    status: undefined,
    username: "",
    email: "",
    password: "",
    token: searchParams.get("token"),
    stage: searchParams.get("token") ? "confirm" : "signup"
  });

  const { t } = useTranslation();
  const navigate = useNavigate();
  const querySignup = useUserStore((state) => state.querySignup);
  const queryConfirmSignup = useUserStore((state) => state.queryConfirmSignup);

  const gotoLogin = () => navigate("/login");
  const goBack = () => navigate("/welcome");

  const signup = async () => {
    if (state.loading) return;

    setState({ ...state, loading: true });
    const status = await useWait(() => querySignup(state.username, state.email))();
    setState({ ...state, loading: false, status: status });
  }

  const confirmSignup = async () => {
    if (state.loading) return;

    setState({ ...state, loading: true });
    const status = await useWait(() => queryConfirmSignup(state.password, state.token))();
    setState({ ...state, loading: false, status: status ? "ok" : "error" });

    if (!status) return;

    const redirect = useAppStore.getState().redirect;
    if (!redirect) navigate("/dashboard");
    else navigate(redirect);
  }

  const signupStage = () => {
    return (
      <>
        {state.status !== "ok" &&
          <>
            <TextInput
              variant="filled"
              label={t("username")}
              description={t("usernameDescription")}
              icon={<IconUser size={16} />}
              placeholder={t("enterUsername")}
              defaultValue={state.username}
              onChange={(ev) => { setState({ ...state, username: ev.target.value }) }}
              disabled={state.stage === "confirm"}
              required
            />

            <TextInput
              variant="filled"
              type="email"
              label={t("email")}
              description={t("emailDescription")}
              icon={<IconAt size={16} />}
              placeholder={t("enterEmail")}
              defaultValue={state.email}
              onChange={(ev) => { setState({ ...state, email: ev.target.value }) }}
              disabled={state.stage === "confirm"}
              required
            />

            <Flex align="center" justify="space-between">
              <Anchor size={15} onClick={goBack}>
                <Flex align="center" gap="xs">
                  <IconArrowLeft size={16} stroke={2.5} />
                  <Text>{t("goBack")}</Text>
                </Flex>
              </Anchor>

              <Button onClick={signup} radius="md">
                {t("continue_")}
              </Button>
            </Flex>
          </>
        }

        {state.status !== "ok" && state.status !== undefined &&
          < Alert
            icon={<IconAlertCircle size={24} />}
            title={t("error.text")}
            color="red"
            variant="light"
          >
            {state.status === "error" && t("error.default")}
            {state.status === "username" && t("error.usernameUsed")}
            {state.status === "email" && t("error.emailUsed")}
            {state.status === "both" && t("error.username&emailUsed")}
          </Alert>
        }

        {state.status === "ok" &&
          <Alert
            icon={<IconInfoCircle size={24} />}
            title={t("info.text")}
            color="blue"
            variant="light"
          >
            {t("info.confirmSignup")}
          </Alert>
        }
      </>
    )
  }

  const confirmSignupStage = () => {
    return (
      <>
        <PasswordInput
          variant="filled"
          label={t("password")}
          description={t("passwordDescription")}
          icon={<IconAsterisk size={16} />}
          placeholder={t("enterPassword")}
          visibilityToggleIcon={({ reveal, size }) =>
            reveal ?
              <IconEyeOff size={size} stroke={2.5} /> :
              <IconEye size={size} stroke={2.5} />
          }
          defaultValue={state.password}
          onChange={(ev) => { setState({ ...state, password: ev.target.value }) }}
          required
        />

        <Flex align="center" justify="space-between">
          <Anchor size={15} onClick={goBack}>
            <Flex align="center" gap="xs">
              <IconArrowLeft size={16} stroke={2.5} />
              <Text>{t("goBack")}</Text>
            </Flex>
          </Anchor>

          <Button onClick={confirmSignup} radius="md">
            {t("finish")}
          </Button>
        </Flex>

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

  return (
    <Flex direction="column" gap="md">
      <Header />

      <Title order={1} size="h2" align="center">
        {t("route.signup.title")}
      </Title>
      <Text color="dimmed" size="md" weight={500} align="center">
        {t("route.signup.description")}
      </Text>

      <Flex justify="center">
        <Card shadow="sm" p="lg" m="md" radius="md" withBorder css={widthLimit}>
          {state.loading && <OverlayLoader />}

          <Flex direction="column" gap="md">
            {/*Use Component() instead of <Component /> to avoid state-loss*/}
            {state.stage === "signup" && signupStage()}
            {state.stage === "confirm" && confirmSignupStage()}
          </Flex>
        </Card>
      </Flex>

      <Flex direction="column" align="center" gap="md">
        <Text color="dimmed" size="sm" align="center" maw={320}>
          <Trans t={t} i18nKey="route.signup.notice" />
        </Text>
      </Flex>

      <Flex direction="column" align="center">
        <Text>{t("alreadyHaveAnAccount")}</Text>

        <Anchor color="blue" size={15} onClick={gotoLogin}>
          <Flex align="center" gap="xs">
            <Text>{t("login")}</Text>
            <IconArrowRight size={16} stroke={2.5} />
          </Flex>
        </Anchor>
      </Flex>

      <Footer />
    </Flex>
  )
}

export default CreateAccount;
