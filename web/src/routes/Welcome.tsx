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

import Header from "../components/Header";
import Footer from "../components/Footer";
import { IconDiscountCheck, IconLock, IconUnlink, IconUser } from "@tabler/icons";
import { widthLimit } from "../styles/css";
import { Trans, useTranslation } from "react-i18next";

const styles: { themeIcons: Partial<ThemeIconProps> } = {
  themeIcons: {
    variant: "light",
    size: 32,
    radius: "md",
  },
};

function Welcome() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const authorized = useUserStore((state) => state.authorized);

  const gotoCreateAccount = () => navigate("/create-account");
  const gotoLogin = () => navigate("/login");
  const gotoDashboard = () => navigate("/dashboard");
  const gotoChangePassword = () => navigate("/change-password");

  return (
    <Flex direction="column" gap="md">
      <Header />

      <Flex direction="column" align="center" gap="md">
        <Title order={1} size={32} align="center">
          <Trans t={t} i18nKey="route.welcome.title" />
        </Title>

        <Text color="dimmed" size="lg" align="center" weight={600} css={widthLimit}>
          {t("route.welcome.description")}
        </Text>
      </Flex>

      <Flex justify="center">
        <Flex direction="column" gap="md" css={widthLimit}>
          {authorized &&
            <Button
              variant="filled"
              onClick={gotoDashboard}
              radius="md">
              {t("continueToDashboard")}
            </Button>
          }
          {!authorized &&
            <>
              <Button variant="filled" onClick={gotoCreateAccount} radius="md">
                {t("createAccount")}
              </Button>
              <Button variant="default" onClick={gotoLogin} radius="md">
                {t("login")}
              </Button>

              <Anchor
                color="blue"
                size={15}
                weight={450}
                onClick={gotoChangePassword}
                align="center"
              >
                {t("forgotYourPassword")}
              </Anchor>
            </>
          }
        </Flex>
      </Flex>

      <Flex justify="center">
        <Flex direction="column" gap="md">
          <Flex align="center" gap="md">
            <ThemeIcon {...styles.themeIcons} color="cyan">
              <IconUser />
            </ThemeIcon>
            {t("route.welcome.list.item1")}
          </Flex>

          <Flex align="center" gap="md">
            <ThemeIcon {...styles.themeIcons} color="blue">
              <IconDiscountCheck />
            </ThemeIcon>
            {t("route.welcome.list.item2")}
          </Flex>

          <Flex align="center" gap="md">
            <ThemeIcon {...styles.themeIcons} color="indigo">
              <IconLock />
            </ThemeIcon>
            {t("route.welcome.list.item3")}
          </Flex>

          <Flex align="center" gap="md">
            <ThemeIcon {...styles.themeIcons} color="violet">
              <IconUnlink />
            </ThemeIcon>
            {t("route.welcome.list.item4")}
          </Flex>
        </Flex>
      </Flex>

      <Space />

      <Footer />
    </Flex>
  );
}

export default Welcome;
