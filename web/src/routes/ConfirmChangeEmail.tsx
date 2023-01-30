import { Alert, Anchor, Card, Flex, Loader, Text, Title } from "@mantine/core";
import { IconAlertCircle, IconArrowLeft, IconCircleCheck } from "@tabler/icons";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUserStore } from "../stores/userStore";
import { widthLimit } from "../styles/css";

interface State {
  loading: boolean;
  status: boolean | undefined;

  token: string;
}

function ConfirmChangeEmail() {
  const [searchParams] = useSearchParams();

  const [state, setState] = useState<State>({
    loading: false,
    status: undefined,
    token: searchParams.get("token") ?? ""
  });

  const navigate = useNavigate();
  const queryConfirmEmailChange = useUserStore(state => state.queryConfirmEmailChange);

  const goBack = () => navigate("/dashboard");

  const confirmEmailChange = async () => {
    if (state.loading) return;

    setState({ ...state, loading: true, status: undefined });
    const status = await queryConfirmEmailChange(state.token);
    setState({ ...state, loading: false, status: status });
  }

  useEffect(() => { confirmEmailChange() }, []);

  return (
    <Flex direction="column" gap="md">
      <Header />

      <Title order={2} align="center">
        Change Email
      </Title>
      <Text color="dimmed" size="md" align="center" weight={500}>
        Want to change your email? No worries.
      </Text>

      <Flex justify="center">
        <Card shadow="sm" p="lg" m="md" radius="md" withBorder css={widthLimit}>
          <Flex direction="column" gap="md">
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

            {state.status === true &&
              <Alert
                icon={<IconCircleCheck size={24} />}
                title="Success"
                color="green"
                variant="light"
              >
                Email is changed.
              </Alert>
            }

            {state.status === false &&
              <Alert
                icon={<IconAlertCircle size={24} />}
                title="Error"
                color="red"
                variant="light"
              >
                An error occured.
              </Alert>
            }
          </Flex>
        </Card>
      </Flex>

      <Footer />
    </Flex>
  )
}

export default ConfirmChangeEmail