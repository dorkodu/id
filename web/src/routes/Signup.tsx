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
  IconAsterisk,
  IconAt,
  IconInfoCircle,
  IconUser,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUserStore } from "../stores/userStore";
import { fullWidth, widthLimit } from "../styles/css";
import { Trans, useTranslation } from "react-i18next";
import { useAppStore } from "../stores/appStore";
import { useWait } from "../components/hooks";
import OverlayLoader from "../components/cards/OverlayLoader";
import InputRequirements, { getRequirement, getRequirementError } from "../components/popovers/InputRequirements";
import { getHotkeyHandler, useFocusWithin } from "@mantine/hooks";
import { VisibilityToggleIcon } from "../components/util";

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
            <Flex>
              <Anchor size={15} onClick={goBack}>
                <Flex align="center" gap="xs">
                  <IconArrowLeft size={16} stroke={2.5} />
                  <Text>{t("goBack")}</Text>
                </Flex>
              </Anchor>
            </Flex>

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
                error={inputReady.username && !usernameFocused && getRequirementError(t, "username", state.username)}
                ref={usernameRef}
                onKeyDown={getHotkeyHandler([["Enter", signup]])}
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
                error={inputReady.email && !emailFocused && getRequirementError(t, "email", state.email)}
                ref={emailRef}
                onKeyDown={getHotkeyHandler([["Enter", signup]])}
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
            variant="filled"
            label={t("password")}
            icon={<IconAsterisk size={16} />}
            placeholder={t("enterPassword")}
            visibilityToggleIcon={VisibilityToggleIcon}
            defaultValue={state.password}
            onChange={(ev) => { setState({ ...state, password: ev.target.value }) }}
            error={inputReady.password && !passwordFocused && getRequirementError(t, "password", state.password)}
            ref={passwordRef}
            onKeyDown={getHotkeyHandler([["Enter", confirmSignup]])}
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
    <Flex mx="md">
      <Flex direction="column" gap="md" css={widthLimit}>
        <Header />

        <Title order={2} align="center">
          {t("route.signup.title")}
        </Title>
        <Text color="dimmed" size="md" align="center" weight={500}>
          {t("route.signup.description")}
        </Text>

        <Flex justify="center">
          <Card shadow="sm" p="md" radius="md" withBorder css={fullWidth}>
            {state.loading && <OverlayLoader />}

            <Flex direction="column" gap="md">
              {/*Use Component() instead of <Component /> to avoid state-loss*/}
              {state.stage === "signup" && signupStage()}
              {state.stage === "confirm" && confirmSignupStage()}
            </Flex>
          </Card>
        </Flex>

        <Text color="dimmed" size="sm" align="center">
          <Trans t={t} i18nKey="route.signup.notice" />
        </Text>

        <Anchor color="blue" align="center" onClick={gotoLogin}>
          {t("alreadyHaveAnAccount")}
        </Anchor>

        <Footer />
      </Flex>
    </Flex>
  )
}

export default CreateAccount;
