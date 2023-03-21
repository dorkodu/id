import CustomLink from '@/components/CustomLink';
import { wait } from '@/components/hooks';
import OverlayLoader from '@/components/loaders/OverlayLoader';
import InputRequirements, { getRequirement, getRequirementError } from '@/components/popovers/InputRequirements';
import { VisibilityToggle } from '@/components/VisibilityToggle';
import PageLayout from '@/layouts/PageLayout'
import { useAppStore } from '@/stores/appStore';
import { Alert, Anchor, Button, Card, Flex, PasswordInput, Text } from '@mantine/core';
import { getHotkeyHandler, useFocusWithin } from '@mantine/hooks';
import { IconAlertCircle, IconArrowLeft, IconAsterisk } from '@tabler/icons-react';
import Head from 'next/head'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useUserContext } from '@/stores/userContext';

interface State {
  loading: boolean;
  status: boolean | undefined;

  password: string;
}

export default function ConfirmSignup() {
  const [state, setState] = useState<State>({
    loading: false,
    status: undefined,
    password: "",
  });

  const router = useRouter();
  const { t } = useTranslation();
  const queryConfirmSignup = useUserContext((state) => state.queryConfirmSignup);

  // Necessary stuff for input validation & error messages
  const [inputReady, setInputReady] = useState({ password: false });
  const { ref: passwordRef, focused: passwordFocused } = useFocusWithin();
  useEffect(() => {
    setInputReady(s => ({ ...s, password: passwordFocused || s.password, }));
  }, [passwordFocused]);

  const confirmSignup = async () => {
    if (state.loading) return;
    const token = typeof router.query.token === "string" ? router.query.token : undefined;

    setState({ ...state, loading: true });
    const status = await wait(() => queryConfirmSignup(state.password, token))();
    setState({ ...state, loading: false, status });

    if (!status) return;

    const redirect = useAppStore.getState().redirect;

    if (!redirect) router.push("/dashboard");
    else router.push(redirect);
  }

  return (
    <>
      <Head>
        <title>Dorkodu ID</title>
        <meta name="title" content="Dorkodu ID" />
        <meta name="description" content="Your Digital Identity @ Dorkodu" />
      </Head>
      <main>
        <PageLayout
          title={t("route.signup.title")}
          description={t("route.signup.description")}
          content={
            <>
              <Card shadow="sm" p="md" radius="md" withBorder>
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
                      variant="filled"
                      label={t("password")}
                      icon={<IconAsterisk size={16} />}
                      placeholder={t("enterPassword")}
                      visibilityToggleIcon={VisibilityToggle}
                      defaultValue={state.password}
                      onChange={(ev) => { setState({ ...state, password: ev.target.value }) }}
                      error={inputReady.password && getRequirementError(t, "password", state.password, passwordFocused)}
                      ref={passwordRef}
                      onKeyDown={getHotkeyHandler([["Enter", confirmSignup]])}
                    />
                  </InputRequirements>

                  <Button onClick={confirmSignup} radius="md">
                    {t("finish")}
                  </Button>

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

              <Text color="dimmed" size="sm" align="center">
                <Trans t={t} i18nKey="route.signup.notice" />
              </Text>
            </>
          }
        />
      </main>
    </>
  )
}

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}