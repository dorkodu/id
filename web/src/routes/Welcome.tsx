import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/userStore";

import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Image,
  Center,
  createStyles,
} from "@mantine/core";

import DorkoduIDKeyIcon from "@assets/dorkodu-id_key.svg";
import { IconArrowLeft } from "@tabler/icons";

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

function Welcome() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const authorized = useUserStore((state) => state.authorized);

  return (
    <>
      {authorized && navigate("/dashboard")}
      {!authorized && (
        <Container size={460} my={25}>
          <Image
            src={DorkoduIDKeyIcon}
            width={100}
            sx={{
              marginBottom: "1.5rem",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />

          <Title order={2} align="center" mb={5}>
            Forgot your password?
          </Title>
          <Text color="dimmed" size="md" align="center" weight={500}>
            Enter your email to get a reset link.
          </Text>

          <Paper withBorder shadow="md" p={30} radius="lg" mt="xl">
            <Group position="apart" mt="lg" className={styles.controls}>
              <Anchor color="blue" size={15} className={styles.control}>
                <Center inline>
                  <IconArrowLeft size={16} stroke={2.5} />
                  <Box ml={5}>Back to login page</Box>
                </Center>
              </Anchor>
              <Button
                className={styles.control}
                onClick={initiateChangePassword}
                radius="md"
              >
                Change Password
              </Button>
              {done && <p>Mail is sent. Please check your email.</p>}
            </Group>
          </Paper>
        </Container>
      )}
    </>
  );
}

export default Welcome;
/*
<button
  onClick={() => {
    navigate("/login");
  }}
>
  login
</button>
<br />
<button
  onClick={() => {
    navigate("/signup");
  }}
>
  signup
</button>
<br />
<button
  onClick={() => {
    navigate("/change_password");
  }}
>
  forgot password
</button>
*/
