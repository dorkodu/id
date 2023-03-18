import CustomLink from '@/components/CustomLink';
import { wait } from '@/components/hooks';
import OverlayLoader from '@/components/loaders/OverlayLoader';
import InputRequirements, { getRequirement, getRequirementError } from '@/components/popovers/InputRequirements';
import PageLayout from '@/layouts/PageLayout'
import { useUserStore } from '@/stores/userStore';
import { Alert, Anchor, Button, Card, Flex, Text, TextInput } from '@mantine/core';
import { getHotkeyHandler, useFocusWithin } from '@mantine/hooks';
import { IconAlertCircle, IconArrowLeft, IconAt, IconInfoCircle, IconUser } from '@tabler/icons-react';
import Head from 'next/head'
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

interface State {
  loading: boolean;
  status: undefined | "ok" | "error" | "username" | "email" | "both";

  username: string;
  email: string;
}

export default function Signup() {
  const [state, setState] = useState<State>({
    loading: false,
    status: undefined,
    username: "",
    email: "",
  });

  const { t } = useTranslation();
  const querySignup = useUserStore((state) => state.querySignup);

  // Necessary stuff for input validation & error messages
  const [inputReady, setInputReady] = useState({ username: false, email: false, password: false });
  const { ref: usernameRef, focused: usernameFocused } = useFocusWithin();
  const { ref: emailRef, focused: emailFocused } = useFocusWithin();
  useEffect(() => {
    setInputReady(s => ({
      ...s,
      username: usernameFocused || s.username,
      email: emailFocused || s.email,
    }))
  }, [usernameFocused, emailFocused]);

  const signup = async () => {
    if (state.loading) return;

    setState({ ...state, loading: true });
    const status = await wait(() => querySignup(state.username, state.email))();
    setState({ ...state, loading: false, status: status });
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
                  {state.status !== "ok" &&
                    <>
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
                        value={state.username}
                        requirements={getRequirement(t, "username")}
                      >
                        <TextInput
                          variant="filled"
                          label={t("username")}
                          icon={<IconUser size={16} />}
                          placeholder={t("enterUsername")}
                          defaultValue={state.username}
                          onChange={(ev) => { setState({ ...state, username: ev.target.value }) }}
                          error={inputReady.username && getRequirementError(t, "username", state.username, usernameFocused)}
                          ref={usernameRef}
                          onKeyDown={getHotkeyHandler([["Enter", signup]])}
                        />
                      </InputRequirements>

                      <InputRequirements
                        value={state.email}
                        requirements={getRequirement(t, "email")}
                      >
                        <TextInput
                          variant="filled"
                          type="email"
                          label={t("email")}
                          icon={<IconAt size={16} />}
                          placeholder={t("enterEmail")}
                          defaultValue={state.email}
                          onChange={(ev) => { setState({ ...state, email: ev.target.value }) }}
                          error={inputReady.email && getRequirementError(t, "email", state.email, emailFocused)}
                          ref={emailRef}
                          onKeyDown={getHotkeyHandler([["Enter", signup]])}
                        />
                      </InputRequirements>

                      <Button onClick={signup} radius="md">
                        {t("continue_")}
                      </Button>
                    </>
                  }

                  {state.status !== "ok" && state.status !== undefined &&
                    <Alert
                      icon={<IconAlertCircle size={24} />}
                      title={t("error.text")}
                      color="red"
                      variant="light"
                    >
                      {state.status === "error" && t("error.default")}
                      {state.status === "username" && t("error.usernameUsed")}
                      {state.status === "email" && t("error.emailUsed")}
                      {state.status === "both" && t("error.username&emailUsed")}
                    </Alert>
                  }

                  {state.status === "ok" &&
                    <Alert
                      icon={<IconInfoCircle size={24} />}
                      title={t("info.text")}
                      color="blue"
                      variant="light"
                    >
                      {t("info.confirmSignup")}
                    </Alert>
                  }
                </Flex>
              </Card>

              <Text color="dimmed" size="sm" align="center">
                <Trans t={t} i18nKey="route.signup.notice" />
              </Text>

              <Flex justify="center">
                <CustomLink href="/login">
                  <Anchor color="blue" align="center" component="div">
                    {t("alreadyHaveAnAccount")}
                  </Anchor>
                </CustomLink>
              </Flex>
            </>
          }
        />
      </main>
    </>
  )
}
