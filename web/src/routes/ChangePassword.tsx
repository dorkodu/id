import { useLayoutEffect, useRef, useState } from "react";
import { useUserStore } from "../stores/userStore";

import {
  createStyles,
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Container,
  Group,
  Anchor,
  Center,
  Box,
  Space,
  Alert,
} from "@mantine/core";

import { IconArrowLeft, IconInfoSquare } from "@tabler/icons";

import { FormPage } from "../components/_shared";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
  },
}));

function ChangePassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { classes: styles } = useStyles();

  const [done, setDone] = useState(false);
  const user = useUserStore((state) => state.user);
  const queryInitiatePasswordChange = useUserStore(
    (state) => state.queryInitiatePasswordChange
  );

  const changePasswordUsername = useRef<HTMLInputElement>(null);
  const changePasswordEmail = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (!user) return;
    changePasswordUsername.current &&
      (changePasswordUsername.current.value = user.username);
    changePasswordEmail.current &&
      (changePasswordEmail.current.value = user.email);
  }, []);

  const initiateChangePassword = async () => {
    const username = changePasswordUsername.current?.value;
    const email = changePasswordEmail.current?.value;
    if (!username || !email) return;
    if (!(await queryInitiatePasswordChange(username, email))) return;
    setDone(true);
  };

  return (
    <Container size={460} my={25}>
      <FormPage.Header />

      <Title order={2} align="center" mb={5}>
        Change Password
      </Title>
      <Text color="dimmed" size="md" align="center" weight={500}>
        Forgot your password? No worries.
      </Text>

      <Paper withBorder shadow="sm" p={30} radius="lg" mt="xl">
        <TextInput
          label="Your Username:"
          placeholder="@username"
          ref={changePasswordUsername}
          radius="md"
          variant="filled"
          required
        />
        <Space h="md" />
        <TextInput
          label="Your Email:"
          placeholder="you@mail.com"
          ref={changePasswordEmail}
          radius="md"
          variant="filled"
          required
        />

        <Group position="apart" mt="lg" className={styles.controls}>
          <Anchor
            color="blue"
            size={15}
            onClick={(e) => {
              e.preventDefault();
              navigate("/welcome");
            }}
            className={styles.control}
          >
            <Center inline>
              <IconArrowLeft size={16} stroke={2.5} />
              <Box ml={5}>Go Back</Box>
            </Center>
          </Anchor>

          <Button
            className={styles.control}
            onClick={initiateChangePassword}
            radius="md"
          >
            Change Password
          </Button>
        </Group>
        {done && (
          <Alert
            icon={<IconInfoSquare size={24} />}
            title="Info"
            color="blue"
            variant="light"
          >
            Mail is sent. Please check your inbox.
          </Alert>
        )}
      </Paper>

      <Space h={64} />

      <FormPage.Footer />
    </Container>
  );
}

export default ChangePassword;
