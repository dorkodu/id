import {
  Alert,
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
import { IconAlertCircle, IconArrowLeft, IconArrowRight, IconCircleCheck, IconEye, IconEyeOff, IconInfoCircle } from "@tabler/icons";
import { useEffect, useReducer } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUserStore } from "../stores/userStore";
import { widthLimit } from "../styles/css";

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

    const redirect = searchParams.get("redirect");
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
          label="Username or Email"
          placeholder="username or you@mail.com"
          defaultValue={state.info}
          onChange={(ev) => { setState({ ...state, info: ev.target.value }) }}
          withAsterisk={true}
          required
        />

        <PasswordInput
          variant="filled"
          label="Password"
          placeholder="password"
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
              <Text>Go Back</Text>
            </Flex>
          </Anchor>

          <Button onClick={login} radius="md">
            Login
          </Button>
        </Flex>

        {state.status === "verify" &&
          <Alert
            icon={<IconInfoCircle size={24} />}
            title="Info"
            color="blue"
            variant="light"
          >
            A new location is detected.
            Please check inbox or spam folder to verify your location,
            then try again.
          </Alert>
        }

        {state.status === "error" &&
          <Alert
            icon={<IconAlertCircle size={24} />}
            title="Error"
            color="red"
            variant="light"
          >
            An error occured.
          </Alert>
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
              <Text>Go Back</Text>
            </Flex>
          </Anchor>
        }

        {state.status === "ok" &&
          <Alert
            icon={<IconCircleCheck size={24} />}
            title="Success"
            color="green"
            variant="light"
          >
            Location is verified.
            You can close this tab and continue to log in.
          </Alert>
        }

        {state.status === "error" &&
          <Alert
            icon={<IconAlertCircle size={24} />}
            title="Error"
            color="red"
            variant="light"
          >
            An error occured.
          </Alert>
        }
      </>
    )
  }

  useEffect(() => { state.stage === "verify" && verifyLogin() }, []);

  return (
    <Flex direction="column" gap="md">
      <Header />

      <Title order={2} align="center">
        Log In
      </Title>
      <Text color="dimmed" size="md" align="center" weight={500}>
        Welcome home. You were missed.
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
              Forgot your password?
            </Anchor>
          </Flex>

          <Flex direction="column" align="center">
            <Text size={15}>Don't have an account?</Text>

            <Anchor color="blue" size={15} onClick={gotoSignup}>
              <Flex align="center" gap="xs">
                <Text>Create Account</Text>
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
