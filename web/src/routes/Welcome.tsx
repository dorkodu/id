import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/userStore";

import {
  Paper,
  Title,
  Text,
  Container,
  Button,
  Stack,
  Box,
  Anchor,
  List,
  ThemeIcon,
  ThemeIconProps,
  Center,
} from "@mantine/core";

import { FormPage } from "../components/_shared";
import {
  IconDiscountCheck,
  IconLock,
  IconUnlink,
  IconUser,
} from "@tabler/icons";

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

  return (
    <>
      {authorized && navigate("/dashboard")}
      {!authorized && (
        <Container size={460} my={25}>
          <FormPage.Header />

          <Title order={1} size={32} align="center" mb={5}>
            Your Digital Life,
            <br />
            One Account.
          </Title>

          <Text
            color="dimmed"
            size="lg"
            align="center"
            weight={600}
            mt="sm"
            maw={320}
            mx="auto">
            Connect with ID, and get the most out of all the Dorkodu apps you
            use.
          </Text>

          <Paper p={30} radius="lg" my="md" maw={300} mx="auto">
            <Stack>
              <Button
                variant="filled"
                onClick={() => {
                  navigate("/create-account");
                }}
                radius="md">
                Create Account
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  navigate("/login");
                }}
                radius="md">
                Log In
              </Button>

              <Anchor
                color="blue"
                size={15}
                weight={450}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/change-password");
                }}
                align="center"
                mt={10}>
                <Box ml={5}>Forgot your password?</Box>
              </Anchor>
            </Stack>
          </Paper>

          <Center>
            <List my="lg" spacing="md" mx="auto" center>
              <List.Item
                icon={
                  <ThemeIcon {...styles.themeIcons} color="cyan">
                    <IconUser />
                  </ThemeIcon>
                }>
                Get a personalized experience.
              </List.Item>

              <List.Item
                icon={
                  <ThemeIcon {...styles.themeIcons} color="blue">
                    <IconDiscountCheck />
                  </ThemeIcon>
                }>
                Be verified everywhere.
              </List.Item>

              <List.Item
                icon={
                  <ThemeIcon {...styles.themeIcons} color="indigo">
                    <IconLock />
                  </ThemeIcon>
                }>
                Your life's information in one place.
              </List.Item>

              <List.Item
                icon={
                  <ThemeIcon {...styles.themeIcons} color="violet">
                    <IconUnlink />
                  </ThemeIcon>
                }>
                All apps are always connected.
              </List.Item>
            </List>
          </Center>

          <FormPage.Footer />
        </Container>
      )}
    </>
  );
}

export default Welcome;
