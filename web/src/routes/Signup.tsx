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
import {
  IconAlertCircle,
  IconArrowLeft,
  IconArrowRight,
  IconAsterisk,
  IconAt,
  IconCircleCheck,
  IconEye,
  IconEyeOff,
  IconInfoCircle,
  IconUser,
} from "@tabler/icons";
import { useEffect, useReducer } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUserStore } from "../stores/userStore";
import { widthLimit } from "../styles/css";

interface State {
  loading: boolean;
  status: undefined | "ok" | "error" | "username" | "email" | "both";

  username: string;
  email: string;
  password: string;
  token: string | null;

  stage: "signup" | "verify" | "confirm";
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
    stage: searchParams.get("token") ? "verify" : "signup"
  });

  const navigate = useNavigate();
  const querySignup = useUserStore((state) => state.querySignup);
  const queryVerifySignup = useUserStore((state) => state.queryVerifySignup);
  const queryConfirmSignup = useUserStore((state) => state.queryConfirmSignup);

  const gotoDashboard = () => navigate("/dashboard");
  const gotoLogin = () => navigate("/login");
  const goBack = () => navigate("/welcome");

  const signup = async () => {
    if (state.loading) return;

    setState({ ...state, loading: true, status: undefined });
    const status = await querySignup(state.username, state.email);
    setState({
      ...state,
      loading: false,
      status: status,
      stage: status === "ok" ? "confirm" : "signup"
    });
  }

  const verifySignup = async () => {
    if (state.loading) return;
    if (state.token === null) return;

    setState({ ...state, loading: true, status: undefined });
    const status = await queryVerifySignup(state.token);
    setState({ ...state, loading: false, status: status ? "ok" : "error" });
  }

  const confirmSignup = async () => {
    if (state.loading) return;

    setState({ ...state, loading: true, status: undefined });
    const status = await queryConfirmSignup(state.username, state.email, state.password);
    setState({ ...state, loading: false, status: status ? "ok" : "error" });

    if (!status) return;

    const redirect = searchParams.get("redirect");
    if (!redirect) navigate("/dashboard");
    else navigate(redirect);
  }

  useEffect(() => { state.stage === "verify" && verifySignup() }, []);

  const signupStage = () => {
    return (
      <>
        <TextInput
          variant="filled"
          label="Username"
          description="Use 1-16 chars from letters (a-z or A-Z), digits (0-9), dot (.), and underscore (_), avoiding consecutive and at start/end dots/underscores."
          icon={<IconUser size={16} />}
          placeholder="Enter username"
          defaultValue={state.username}
          onChange={(ev) => { setState({ ...state, username: ev.target.value }) }}
          disabled={state.stage === "confirm"}
          required
        />

        <TextInput
          variant="filled"
          type="email"
          label="Email"
          description="Enter a valid email address."
          icon={<IconAt size={16} />}
          placeholder="Enter email"
          defaultValue={state.email}
          onChange={(ev) => { setState({ ...state, email: ev.target.value }) }}
          disabled={state.stage === "confirm"}
          required
        />

        <Flex align="center" justify="space-between">
          <Anchor size={15} onClick={goBack}>
            <Flex align="center" gap="xs">
              <IconArrowLeft size={16} stroke={2.5} />
              <Text>Go Back</Text>
            </Flex>
          </Anchor>

          <Button onClick={signup} radius="md">
            Continue
          </Button>
        </Flex>

        {state.status !== "ok" && state.status !== undefined &&
          < Alert
            icon={<IconAlertCircle size={24} />}
            title="Info"
            color="red"
            variant="light"
          >
            {state.status === "error" && "An error occured."}
            {state.status === "username" && "Username is already in use."}
            {state.status === "email" && "Email is already in use."}
            {state.status === "both" && "Username and email are already in use."}
          </Alert>
        }
      </>
    )
  }

  const verifySignupStage = () => {
    return (
      <>
        {state.loading &&
          <Flex justify="center">
            <Loader variant="dots" color="green" />
          </Flex>
        }

        {!state.loading &&
          <Anchor size={15} onClick={gotoDashboard}>
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
            Email is verified.
            You can close this tab and continue to create your account.
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

  const confirmSignupStage = () => {
    return (
      <>
        <PasswordInput
          variant="filled"
          label="Password"
          description="Minimum 8 characters required."
          icon={<IconAsterisk size={16} />}
          placeholder="Enter password"
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
              <Text>Go Back</Text>
            </Flex>
          </Anchor>

          <Button onClick={confirmSignup} radius="md">
            Finish
          </Button>
        </Flex>

        {state.status === "ok" &&
          <Alert
            icon={<IconInfoCircle size={24} />}
            title="Info"
            color="blue"
            variant="light"
          >
            Mail is sent.
            Please check inbox or spam folder to verify your email.
          </Alert>
        }

        {state.status === "error" &&
          <Alert
            icon={<IconAlertCircle size={24} />}
            title="Info"
            color="red"
            variant="light"
          >
            An error occured.
          </Alert>
        }
      </>
    )
  }

  return (
    <Flex direction="column" gap="md">
      <Header />

      <Title order={1} size="h2" align="center">
        Create Your Account
      </Title>
      <Text color="dimmed" size="md" weight={500} align="center">
        In a minute, say hello to your new digital life.
      </Text>

      <Flex justify="center">
        <Card shadow="sm" p="lg" m="md" radius="md" withBorder css={widthLimit}>
          <LoadingOverlay visible={state.loading} overlayBlur={2} />

          <Flex direction="column" gap="md">
            {/*Use Component() instead of <Component /> to avoid state-loss*/}
            {state.stage === "signup" && signupStage()}
            {state.stage === "verify" && verifySignupStage()}
            {state.stage === "confirm" && confirmSignupStage()}
          </Flex>
        </Card>
      </Flex>

      {state.stage !== "verify" &&
        <>
          <Flex direction="column" align="center" gap="md">
            <Text color="dimmed" size="sm" align="center" maw={320}>
              By creating an account, you will agree to
              Dorkodu's <b>Terms of Service</b> and <b>Privacy Policy</b>.
            </Text>
          </Flex>

          <Flex direction="column" align="center">
            <Text>Already have an account? </Text>

            <Anchor color="blue" size={15} onClick={gotoLogin}>
              <Flex align="center" gap="xs">
                <Text>Log In</Text>
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

export default CreateAccount;
