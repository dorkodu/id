import {
  Alert,
  Anchor,
  Box,
  Button,
  Center,
  Container,
  createStyles,
  Group,
  Paper,
  PasswordInput,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconEye,
  IconEyeOff,
  IconInfoSquare,
} from "@tabler/icons";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FormPage } from "../components/_shared";
import { useUserStore } from "../stores/userStore";

const useStyles = createStyles((theme) => ({
  controls: {
    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column-reverse",
    },
  },

  control: {
    [theme.fn.smallerThan("xs")]: {
      width: "100%",
      textAlign: "center",
    },
    [theme.fn.largerThan("xs")]: {
      width: "30%",
      textAlign: "center",
    },
  },
}));

function Login() {
  const { classes: styles } = useStyles();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const queryLogin = useUserStore((state) => state.queryLogin);
  const queryVerifyLogin = useUserStore((state) => state.queryVerifyLogin);

  const initialStage = searchParams.get("token") ? "verify" : "login";
  const [stage, setStage] = useState<"login" | "verify" | "confirm">(
    initialStage
  );
  const [status, setStatus] = useState<boolean | undefined>(undefined);

  const loginInfo = useRef<HTMLInputElement>(null);
  const loginPassword = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (stage === "verify") verifyLogin();
  }, []);

  const login = async () => {
    const info = loginInfo.current?.value;
    const password = loginPassword.current?.value;
    if (!info || !password) return;
    const res = await queryLogin(info, password);
    if (res === "error") return;
    if (res === "confirm") {
      setStage("confirm");
      return;
    }

    const redirect = searchParams.get("redirect");
    if (!redirect) navigate("/dashboard");
    else navigate(redirect);
  };

  const verifyLogin = async () => {
    const token = searchParams.get("token");
    if (!token) return;

    const verified = await queryVerifyLogin(token);
    setStatus(verified);
  };

  return (
    <Container size={460} my={25}>
      {stage !== "verify" && (
        <>
          <FormPage.Header />

          <Title order={2} align="center" mb={5}>
            Log In
          </Title>
          <Text color="dimmed" size="md" align="center" weight={500}>
            Welcome home. You were missed.
          </Text>

          <Paper withBorder shadow="sm" p={30} radius="lg" mt="xl">
            <TextInput
              label="Username or Email"
              placeholder="Enter @username"
              ref={loginInfo}
              type={"text"}
              disabled={stage === "confirm"}
              required
              withAsterisk={false}
              radius="md"
              variant="filled"
            />

            <Space h="md" />

            <PasswordInput
              label="Password"
              placeholder="Enter Password"
              visibilityToggleIcon={({ reveal, size }) =>
                reveal ? (
                  <IconEyeOff size={size} stroke={2.5} />
                ) : (
                  <IconEye size={size} stroke={2.5} />
                )
              }
              variant="filled"
              required
              withAsterisk={false}
            />

            <Group position="apart" mt="lg" className={styles.controls}>
              <Anchor
                size={15}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/welcome");
                }}
                className={styles.control}>
                <Center inline>
                  <IconArrowLeft size={16} stroke={2.5} />
                  <Box ml={5}>Go Back</Box>
                </Center>
              </Anchor>

              <Button className={styles.control} onClick={login} radius="md">
                Login
              </Button>
            </Group>
          </Paper>

          <Stack my="md">
            <Anchor
              color="blue"
              size={15}
              weight={450}
              onClick={(e) => {
                e.preventDefault();
                navigate("/change_password");
              }}
              align="center"
              mt={10}>
              <Box ml={5}>Forgot your password?</Box>
            </Anchor>

            <Text size={14} align="center">
              Don't have an account?
            </Text>
            <Anchor
              color="blue"
              weight={450}
              onClick={(e) => {
                e.preventDefault();
                navigate("/signup");
              }}
              align="center"
              mt={10}>
              Create an account.
            </Anchor>
          </Stack>

          <FormPage.Footer />
        </>
      )}
      {stage === "verify" && (
        <>
          {stage === "verify" && status === undefined && <>loading...</>}
          {stage === "verify" && status === true && (
            <Alert
              icon={<IconCheck size={24} />}
              title="Status"
              color="green"
              variant="light">
              Verified.
            </Alert>
          )}
          {stage === "verify" && status === false && (
            <Alert
              icon={<IconCheck size={24} />}
              title="Status"
              color="red"
              variant="light">
              Verification failed.
            </Alert>
          )}
        </>
      )}
    </Container>
  );
}

export default Login;
