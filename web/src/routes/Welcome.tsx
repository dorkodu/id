import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/userStore";
import { Button, Anchor, ThemeIcon, ThemeIconProps, Flex } from "@mantine/core";
import { IconDiscountCheck, IconLock, IconUnlink, IconUser } from "@tabler/icons-react";
import { fullWidth } from "../styles/css";
import { useTranslation } from "react-i18next";
import PageLayout from "../components/layouts/PageLayout";

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
    <PageLayout
      title={t("route.welcome.title")}
      description={t("route.welcome.description")}
    >
      <Flex direction="column" gap="md" sx={fullWidth}>
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
              align="center"
              onClick={gotoChangePassword}
            >
              {t("forgotYourPassword")}
            </Anchor>
          </>
        }
      </Flex>

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
    </PageLayout>
  )
}

export default Welcome;
