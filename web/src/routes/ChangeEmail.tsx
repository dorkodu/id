import { Alert, Anchor, Button, Card, Flex, LoadingOverlay, Text, TextInput, Title } from "@mantine/core";
import { IconAlertCircle, IconArrowLeft, IconAt, IconInfoCircle } from "@tabler/icons";
import { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUserStore } from "../stores/userStore";

interface State {
  loading: boolean;
  status: boolean | undefined;

  email: string;
}

function ChangeEmail() {
  const [state, setState] = useReducer((prev: State, next: State) => {
    const newState = { ...prev, ...next };

    if (newState.email.length > 320)
      newState.email = newState.email.substring(0, 320);

    return newState;
  }, { loading: false, status: undefined, email: "" });

  const navigate = useNavigate();
  const queryInitiateEmailChange = useUserStore(state => state.queryInitiateEmailChange);

  const goBack = () => navigate(-1);

  const initiateEmailChange = async () => {
    if (state.loading) return;

    setState({ ...state, loading: true, status: undefined });
    const status = await queryInitiateEmailChange(state.email);
    setState({ ...state, loading: false, status: status });
  }

  return (
    <Flex direction="column">
      <Header />

      <Title order={2} align="center" mb={5}>
        Change Email
      </Title>
      <Text color="dimmed" size="md" align="center" weight={500}>
        lorem ipsum
      </Text>

      <Card shadow="sm" p="lg" m="md" radius="md" withBorder>
        <LoadingOverlay visible={state.loading} overlayBlur={2} />

        <Flex direction="column" gap="md">
          <TextInput
            label="New Email"
            placeholder="you@mail.com"
            description="Enter a valid email address."
            defaultValue={state.email}
            onChange={(ev) => { setState({ ...state, email: ev.target.value }) }}
            radius="md"
            variant="filled"
            required
            icon={<IconAt size={16} />}
            type={"email"}
          />

          <Flex align="center" justify="space-between">
            <Anchor size={15} onClick={goBack}>
              <Flex align="center" gap="xs">
                <IconArrowLeft size={16} stroke={2.5} />
                <Text>Go Back</Text>
              </Flex>
            </Anchor>

            <Button onClick={initiateEmailChange} radius="md">
              Change Email
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

export default ChangeEmail