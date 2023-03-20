import CustomLink from '@/components/CustomLink';
import { wait } from '@/components/hooks';
import OverlayLoader from '@/components/loaders/OverlayLoader';
import InputRequirements, { getRequirement, getRequirementError } from '@/components/popovers/InputRequirements';
import { VisibilityToggle } from '@/components/VisibilityToggle';
import PageLayout from '@/layouts/PageLayout'
import { useAppStore } from '@/stores/appStore';
import { useUserStore } from '@/stores/userStore';
import { Alert, Anchor, Button, Card, Flex, PasswordInput, Text } from '@mantine/core';
import { getHotkeyHandler, useFocusWithin } from '@mantine/hooks';
import { IconAlertCircle, IconArrowLeft, IconAsterisk } from '@tabler/icons-react';
import Head from 'next/head'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'next-i18next';

interface State {
  loading: boolean;
  status: boolean | undefined;

  password: string;
  token: string | undefined;
}

export default function ConfirmSignup() {
  const router = useRouter();
  const { query } = router;
  const token: State["token"] = typeof query.token === "string" ? query.token : undefined;

  const [state, setState] = useState<State>({
    loading: false,
    status: undefined,
    password: "",
    token: token,
  });

  const { t } = useTranslation();
  const queryConfirmSignup = useUserStore((state) => state.queryConfirmSignup);

  // Necessary stuff for input validation & error messages
  const [inputReady, setInputReady] = useState({ password: false });
  const { ref: passwordRef, focused: passwordFocused } = useFocusWithin();
  useEffect(() => {
    setInputReady(s => ({ ...s, password: passwordFocused || s.password, }));
  }, [passwordFocused]);

  const confirmSignup = async () => {
    if (state.loading) return;

    setState({ ...state, loading: true });
    const status = await wait(() => queryConfirmSignup(state.password, state.token))();
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
