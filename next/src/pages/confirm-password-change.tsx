import { Alert, Anchor, Button, Card, Flex, PasswordInput, Text } from "@mantine/core";
import { IconAlertCircle, IconArrowLeft, IconAsterisk, IconCircleCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { fullWidth } from "../styles/css";
import { useTranslation } from "next-i18next";
import { getHotkeyHandler, useFocusWithin } from "@mantine/hooks";
import InputRequirements, { getRequirement, getRequirementError } from "../components/popovers/InputRequirements";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useUserStore } from "@/stores/userStore";
import { wait } from "@/components/hooks";
import PageLayout from "@/layouts/PageLayout";
import OverlayLoader from "@/components/loaders/OverlayLoader";
import { VisibilityToggle } from "@/components/VisibilityToggle";
import Head from "next/head";
import CustomLink from "@/components/CustomLink";
import { useRouter } from "next/router";

interface State {
  loading: boolean;
  status: boolean | undefined;

  password: string;
}

function ConfirmPasswordChange() {
  const [state, setState] = useState<State>({
    loading: false,
    status: undefined,
    password: "",
  });

  const router = useRouter();
  const { t } = useTranslation();
  const queryConfirmPasswordChange = useUserStore(state => state.queryConfirmPasswordChange);

  const confirmChangePassword = async () => {
    const token = typeof router.query.token === "string" ? router.query.token : undefined;
    if (!token) return;
    if (state.loading) return;

    setState({ ...state, loading: true });
    const status = await wait(() => queryConfirmPasswordChange(state.password, token))();
    setState({ ...state, loading: false, status: status });
  }

  // Necessary stuff for input validation & error messages
  const [inputReady, setInputReady] = useState(false);
  const { ref, focused } = useFocusWithin();
  useEffect(() => { setInputReady(focused || inputReady) }, [focused]);

  return (
    <>
      <Head>
        <title>Dorkodu ID</title>
        <meta name="title" content="Dorkodu ID" />
        <meta name="description" content="Your Digital Identity @ Dorkodu" />
      </Head>
      <main>
        <PageLayout
          title={t("route.confirmPasswordChange.title")}
          description={t("route.confirmPasswordChange.description")}
          content={
            <Card shadow="sm" p="md" radius="md" withBorder sx={fullWidth}>
              {state.loading && <OverlayLoader />}

              <Flex direction="column" gap="md">
                <Flex>
                  <CustomLink href="/">
                    <Anchor size={15} component="div">
                      <Flex align="center" gap="xs">
                        <IconArrowLeft size={16} stroke={2.5} />
                        <Text>{t("goBack")}</Text>
                      </Flex>
                    </Anchor>
                  </CustomLink>
                </Flex>

                <InputRequirements
                  value={state.password}
                  requirements={getRequirement(t, "password")}
                >
                  <PasswordInput
                    label={t("newPassword")}
                    placeholder={t("enterNewPassword")}
                    defaultValue={state.password}
                    onChange={(ev) => { setState({ ...state, password: ev.target.value }) }}
                    visibilityToggleIcon={VisibilityToggle}
                    variant="filled"
                    icon={<IconAsterisk size={16} />}
                    error={inputReady && getRequirementError(t, "password", state.password, focused)}
                    ref={ref}
                    onKeyDown={getHotkeyHandler([["Enter", confirmChangePassword]])}
                  />
                </InputRequirements>

                <Button onClick={confirmChangePassword} radius="md">
                  {t("changePassword")}
                </Button>

                {state.status === true &&
                  <Alert
                    icon={<IconCircleCheck size={24} />}
                    title={t("success.text")}
                    color="green"
                    variant="light"
                  >
                    {t("success.passwordChanged")}
                  </Alert>
                }

                {state.status === false &&
                  <Alert
                    icon={<IconAlertCircle size={24} />}
                    title={t("error.text")}
                    color="red"
                    variant="light"
                  >
                    {t("error.default")}
                  </Alert>
                }
              </Flex>
            </Card>
          }
        />
      </main>
    </>
  )
}

export default ConfirmPasswordChange

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}