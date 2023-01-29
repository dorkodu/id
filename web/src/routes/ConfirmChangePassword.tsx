import { Alert, Anchor, Button, Card, Flex, LoadingOverlay, PasswordInput, Text, Title } from "@mantine/core";
import { IconAlertCircle, IconArrowLeft, IconAsterisk, IconEye, IconEyeOff, IconInfoCircle } from "@tabler/icons";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUserStore } from "../stores/userStore";

interface State {
  loading: boolean;
  status: boolean | undefined;

  password: string;
  token: string;
}

function ConfirmChangePassword() {
  const [searchParams] = useSearchParams();

  const [state, setState] = useState<State>({
    loading: false,
    status: undefined,
    password: "",
    token: searchParams.get("token") ?? ""
  });

  const navigate = useNavigate();
  const queryConfirmPasswordChange = useUserStore(state => state.queryConfirmPasswordChange);
  const goBack = () => navigate("/dashboard");

  const confirmChangePassword = async () => {
    if (state.loading) return;

    setState({ ...state, loading: true, status: undefined });
    const status = await queryConfirmPasswordChange(state.password, state.token);
    setState({ ...state, loading: false, status: status });
  }

  return (
    <Flex direction="column">
      <Header />

      <Title order={2} align="center" mb={5}>
        Change Password
      </Title>
      <Text color="dimmed" size="md" align="center" weight={500}>
        Forgot your password? No worries.
      </Text>

      <Card shadow="sm" p="lg" m="md" radius="md" withBorder>
        <LoadingOverlay visible={state.loading} overlayBlur={2} />

        <Flex direction="column" gap="md">
          <PasswordInput
            label="New Password"
            placeholder="Password"
            description="Minimum 8 characters required."
            defaultValue={state.password}
            onChange={(ev) => { setState({ ...state, password: ev.target.value }) }}
            visibilityToggleIcon={({ reveal, size }) =>
              reveal ?
                <IconEyeOff size={size} stroke={2.5} /> :
                <IconEye size={size} stroke={2.5} />
            }
            variant="filled"
            aria-required
            icon={<IconAsterisk size={16} />}
          />

          <Flex align="center" justify="space-between">
            <Anchor size={15} onClick={goBack}>
              <Flex align="center" gap="xs">
                <IconArrowLeft size={16} stroke={2.5} />
                <Text>Go Back</Text>
              </Flex>
            </Anchor>

            <Button onClick={confirmChangePassword} radius="md">
              Change Password
            </Button>
          </Flex>

          {state.status === true &&
            <Alert
              icon={<IconInfoCircle size={24} />}
              title="Info"
              color="blue"
              variant="light"
            >
              Mail is sent. Please check your inbox.
            </Alert>
          }

          {state.status === false &&
            <Alert
              icon={<IconAlertCircle size={24} />}
              title="Info"
              color="red"
              variant="light"
            >
              An error occured.
            </Alert>
          }
        </Flex>
      </Card>

      <Footer />
    </Flex>
  )
}

export default ConfirmChangePassword