import {
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
  IconAsterisk,
  IconAt,
  IconEye,
  IconEyeOff,
  IconSquareAsterisk,
  IconUser,
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
      textAlign: "center",
    },
  },
}));

function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { classes: styles } = useStyles();

  const querySignup = useUserStore((state) => state.querySignup);
  const queryVerifySignup = useUserStore((state) => state.queryVerifySignup);
  const queryConfirmSignup = useUserStore((state) => state.queryConfirmSignup);

  const initialStage = searchParams.get("token") ? "verify" : "signup";
  const [stage, setStage] = useState<"signup" | "verify" | "confirm">(
    initialStage
  );
  const [status, setStatus] = useState<boolean | undefined>(undefined);

  const signupUsername = useRef<HTMLInputElement>(null);
  const signupEmail = useRef<HTMLInputElement>(null);
  const signupPassword = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (stage === "verify") verifySignup();
  }, []);

  const signup = async () => {
    const username = signupUsername.current?.value;
    const email = signupEmail.current?.value;
    if (!username || !email) return;
    if (!(await querySignup(username, email))) return;
    setStage("confirm");
  };

  const verifySignup = async () => {
    const token = searchParams.get("token");
    if (!token) return;

    const verified = await queryVerifySignup(token);
    setStatus(verified);
  };

  const confirmSignup = async () => {
    const username = signupUsername.current?.value;
    const email = signupEmail.current?.value;
    const password = signupPassword.current?.value;
    if (!username || !email || !password) return;
    if (!(await queryConfirmSignup(username, email, password))) return;

    const redirect = searchParams.get("redirect");
    if (!redirect) navigate("/dashboard");
    else navigate(redirect);
  };

  return (
    <Container size={460} my={25}>
      {stage !== "verify" && (
        <>
          <FormPage.Header />

          <Title order={1} size="h2" align="center" mb={5}>
            Create Your Account
          </Title>
          <Text color="dimmed" size="md" align="center" weight={500}>
            In a minute, say hello to your new digital life.
          </Text>

          <Paper withBorder shadow="sm" p={30} radius="lg" mt="xl">
            <Stack>
              <TextInput
                label="Your Username"
                placeholder="@username"
                description="You can use letters (a-z), digits (0-9), dot (.) and underscore (_) 16 characters maximum."
                disabled={stage === "confirm"}
                required
                radius="md"
                variant="filled"
                icon={<IconUser size={16} />}
                ref={signupUsername}
              />

              <TextInput
                label="Your Email"
                placeholder="example@mail.com"
                description="Enter a valid email address."
                icon={<IconAt size={16} />}
                ref={signupEmail}
                required
                type={"email"}
                disabled={stage === "confirm"}
                variant="filled"
              />

              <PasswordInput
                label="New Password"
                placeholder="Password"
                description="Minimum 8 characters required."
                visibilityToggleIcon={({ reveal, size }) =>
                  reveal ? (
                    <IconEyeOff size={size} stroke={2.5} />
                  ) : (
                    <IconEye size={size} stroke={2.5} />
                  )
                }
                variant="filled"
                required
                disabled={stage === "confirm"}
                icon={<IconAsterisk size={16} />}
                ref={signupPassword}
              />
            </Stack>

            <Group position="right" mt="lg" className={styles.controls}>
              <Button
                className={styles.control}
                onClick={() =>
                  stage === "signup" ? signup() : confirmSignup()
                }
                radius="md">
                Create Account
              </Button>
            </Group>
          </Paper>

          <Stack my="md" align="center">
            <Text color="dimmed" size="sm" align="center" maw={320}>
              By clicking "Create Account", you will agree to Dorkodu's{" "}
              <b>Terms of Service</b> and <b>Privacy Policy</b>.
            </Text>

            <Text size="sm" sx={{}}>
              <Box>Already have an account? </Box>
              <Anchor
                color="blue"
                size={15}
                weight={450}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/change_password");
                }}
                align="center">
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 14,
                  }}>
                  Log In
                  <IconArrowRight size={20} />
                </Box>
              </Anchor>
            </Text>
          </Stack>

          <FormPage.Footer />
        </>
      )}
      {stage === "verify" && status === undefined && <>loading...</>}
      {stage === "verify" && status === true && <>verified.</>}
      {stage === "verify" && status === false && <>couldn't verify.</>}
    </Container>
  );
}

export default Signup;
