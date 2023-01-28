import { useReducer } from "react";
import { useUserStore } from "../stores/userStore";

import { Title, Text, TextInput, Button, Anchor, Alert, Card, Flex, LoadingOverlay } from "@mantine/core";
import { IconAlertCircle, IconArrowLeft, IconInfoCircle } from "@tabler/icons";

import { FormPage } from "../components/_shared";
import { useNavigate } from "react-router-dom";

interface State {
  loading: boolean;
  status: boolean | undefined;

  username: string;
  email: string;
}

function ChangePassword() {
  const user = useUserStore((state) => state.user);

  const navigate = useNavigate();
  const queryInitiatePasswordChange = useUserStore((state) => state.queryInitiatePasswordChange);

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
    username: user?.username ?? "",
    email: user?.email ?? ""
  });

  const goBack = () => navigate(-1);

  const initiateChangePassword = async () => {
    if (state.loading) return;

    setState({ ...state, loading: true, status: undefined });
    const status = await queryInitiatePasswordChange(state.username, state.email);
    setState({ ...state, loading: false, status: status });
  };

  return (
    <Flex direction="column">
      <FormPage.Header />

      <Title order={2} align="center" mb={5}>
        Change Password
      </Title>
      <Text color="dimmed" size="md" align="center" weight={500}>
        Forgot your password? No worries.
      </Text>

      <Card shadow="sm" p="lg" m="md" radius="md" withBorder>
        <LoadingOverlay visible={state.loading} overlayBlur={2} />

        <Flex direction="column" gap="md">
          <TextInput
            label="Your Username:"
            placeholder="@username"
            defaultValue={state.username}
            onChange={(ev) => { setState({ ...state, username: ev.target.value }) }}
            radius="md"
            variant="filled"
            required
          />

          <TextInput
            label="Your Email:"
            placeholder="you@mail.com"
            defaultValue={state.email}
            onChange={(ev) => { setState({ ...state, email: ev.target.value }) }}
            radius="md"
            variant="filled"
            required
          />

          <Flex align="center" justify="space-between">
            <Anchor size={15} onClick={goBack}>
              <Flex align="center" gap="xs">
                <IconArrowLeft size={16} stroke={2.5} />
                <Text>Go Back</Text>
              </Flex>
            </Anchor>

            <Button onClick={initiateChangePassword} radius="md">
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

      <FormPage.Footer />
    </Flex>
  );
}

export default ChangePassword;
