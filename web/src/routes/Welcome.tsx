import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/userStore";

import {
  Title,
  Text,
  Button,
  Anchor,
  ThemeIcon,
  ThemeIconProps,
  Flex,
  Space,
} from "@mantine/core";

import { FormPage } from "../components/_shared";
import { IconDiscountCheck, IconLock, IconUnlink, IconUser } from "@tabler/icons";
import { MouseEvent } from "react";

const styles: { themeIcons: Partial<ThemeIconProps> } = {
  themeIcons: {
    variant: "light",
    size: 32,
    radius: "md",
  },
};

function Welcome() {
  const navigate = useNavigate();

  const authorized = useUserStore((state) => state.authorized);

  const gotoCreateAccount = () => navigate("/create-account");
  const gotoLogin = () => navigate("/login");
  const gotoChangePassword = (ev: MouseEvent) => {
    ev.preventDefault();
    navigate("/change-password");
  }

  const AuthOptions = () => (
    <Flex direction="column" gap="md">
      <Button variant="filled" onClick={gotoCreateAccount} radius="md">
        Create Account
      </Button>
      <Button variant="default" onClick={gotoLogin} radius="md">
        Log In
      </Button>

      <Anchor
        color="blue"
        size={15}
        weight={450}
        onClick={gotoChangePassword}
        align="center"
      >
        Forgot your password?
      </Anchor>
    </Flex>
  );

  return (
    <Flex direction="column" align="center" gap="md">
      <FormPage.Header />

      <Title order={1} size={32} align="center">
        Your Digital Life,
        <br />
        One Account.
      </Title>

      <Text color="dimmed" size="lg" align="center" weight={600} maw={320}>
        Connect with ID, and get the most out of all the Dorkodu apps you use.
      </Text>

      <Space h="md" />

      {authorized &&
        <Button
          variant="filled"
          onClick={() => {
            navigate("/dashboard");
          }}
          radius="md">
          Continue to Dashboard
        </Button>
      }
      {!authorized && <AuthOptions />}

      <Space h="md" />

      <Flex direction="column" gap="md">
        <Flex align="center" gap="md">
          <ThemeIcon {...styles.themeIcons} color="cyan">
            <IconUser />
          </ThemeIcon>
          Get a personalized experience.
        </Flex>

        <Flex align="center" gap="md">
          <ThemeIcon {...styles.themeIcons} color="blue">
            <IconDiscountCheck />
          </ThemeIcon>
          Be verified everywhere.
        </Flex>

        <Flex align="center" gap="md">
          <ThemeIcon {...styles.themeIcons} color="indigo">
            <IconLock />
          </ThemeIcon>
          Your life's information in one place.
        </Flex>

        <Flex align="center" gap="md">
          <ThemeIcon {...styles.themeIcons} color="violet">
            <IconUnlink />
          </ThemeIcon>
          All apps are always connected.
        </Flex>
      </Flex>

      <FormPage.Footer />
    </Flex>
  );
}

export default Welcome;
