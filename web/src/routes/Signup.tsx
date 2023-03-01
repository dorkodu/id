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
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUserStore } from "../stores/userStore";
import { widthLimit } from "../styles/css";
import { Trans, useTranslation } from "react-i18next";
import { useAppStore } from "../stores/appStore";
import { useWait } from "../components/hooks";
import OverlayLoader from "../components/cards/OverlayLoader";
import InputRequirements, { getRequirement, getRequirementError } from "../components/popovers/InputRequirements";
import { useFocusWithin } from "@mantine/hooks";

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

  const [state, setState] = useState<State>({
    loading: false,
    status: undefined,
    username: "",
    email: "",
    password: "",
    token: searchParams.get("token"),
    stage: searchParams.get("token") ? "confirm" : "signup",
  });

  const { t } = useTranslation();
  const navigate = useNavigate();
  const querySignup = useUserStore((state) => state.querySignup);
  const queryConfirmSignup = useUserStore((state) => state.queryConfirmSignup);

  const gotoLogin = () => navigate("/login");
  const goBack = () => navigate("/welcome");

  // Necessary stuff for input validation & error messages
  const [inputReady, setInputReady] = useState({ username: false, email: false, password: false });
  const { ref: usernameRef, focused: usernameFocused } = useFocusWithin();
  const { ref: emailRef, focused: emailFocused } = useFocusWithin();
  const { ref: passwordRef, focused: passwordFocused } = useFocusWithin();
  useEffect(() => {
    setInputReady(s => ({
      ...s,
      username: usernameFocused || s.username,
      email: emailFocused || s.email,
      password: passwordFocused || s.password,
    }))
  }, [usernameFocused, emailFocused, passwordFocused]);

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
            <Anchor size={15} onClick={goBack}>
              <Flex align="center" gap="xs">
                <IconArrowLeft size={16} stroke={2.5} />
                <Text>{t("goBack")}</Text>
              </Flex>
            </Anchor>

            <InputRequirements
              value={state.username}
              requirements={getRequirement(t, "username")}
            >
              <TextInput
                variant="filled"
                label={t("username")}
                icon={<IconUser size={16} />}
                placeholder={t("enterUsername")}
                defaultValue={state.username}
                onChange={(ev) => { setState({ ...state, username: ev.target.value }) }}
                disabled={state.stage === "confirm"}
                required
                error={inputReady.username && !usernameFocused && getRequirementError(t, "username", state.username)}
                ref={usernameRef}
              />
            </InputRequirements>

            <InputRequirements
              value={state.email}
              requirements={getRequirement(t, "email")}
            >
              <TextInput
                variant="filled"
                type="email"
                label={t("email")}
                icon={<IconAt size={16} />}
                placeholder={t("enterEmail")}
                defaultValue={state.email}
                onChange={(ev) => { setState({ ...state, email: ev.target.value }) }}
                disabled={state.stage === "confirm"}
                required
                error={inputReady.email && !emailFocused && getRequirementError(t, "email", state.email)}
                ref={emailRef}
              />
            </InputRequirements>

            <Button onClick={signup} radius="md">
              {t("continue_")}
            </Button>
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
        <Anchor size={15} onClick={goBack}>
          <Flex align="center" gap="xs">
            <IconArrowLeft size={16} stroke={2.5} />
            <Text>{t("goBack")}</Text>
          </Flex>
        </Anchor>

        <InputRequirements
          value={state.password}
          requirements={getRequirement(t, "password")}
        >
          <PasswordInput
            variant="filled"
            label={t("password")}
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
            error={inputReady.password && !passwordFocused && getRequirementError(t, "password", state.password)}
            ref={passwordRef}
          />
        </InputRequirements>

        <Button onClick={confirmSignup} radius="md">
          {t("finish")}
        </Button>

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
