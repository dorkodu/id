import CustomLink from '@/components/CustomLink'
import { wait } from '@/components/hooks'
import OverlayLoader from '@/components/loaders/OverlayLoader'
import { VisibilityToggle } from '@/components/VisibilityToggle'
import PageLayout from '@/layouts/PageLayout'
import { Alert, Anchor, Button, Card, Flex, PasswordInput, Text, TextInput } from '@mantine/core'
import { getHotkeyHandler } from '@mantine/hooks'
import { IconAlertCircle, IconArrowLeft, IconInfoCircle } from '@tabler/icons-react'
import Head from 'next/head'
import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useUserStore } from '@/stores/userStore'

interface State {
  loading: boolean;
  status: undefined | "verify" | "error" | "ok";

  info: string;
  password: string;
}

export default function Login() {
  const [state, setState] = useState<State>({
    loading: false,
    status: undefined,
    info: "",
    password: "",
  });

  const { t } = useTranslation();
  const queryLogin = useUserStore((state) => state.queryLogin);

  const login = async () => {
    if (state.loading) return;

    setState({ ...state, loading: true });
    const status = await wait(() => queryLogin(state.info, state.password))();
    setState({ ...state, loading: false, status: status });

    if (status !== "ok") return;
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
          title={t("route.login.title")}
          description={t("route.login.description")}
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

                  <TextInput
                    variant="filled"
                    type="text"
                    label={t("usernameOrEmail")}
                    placeholder={t("enterUsernameOrEmail")}
                    defaultValue={state.info}
                    onChange={(ev) => { setState({ ...state, info: ev.target.value }) }}
                    withAsterisk={true}
                    onKeyDown={getHotkeyHandler([["Enter", login]])}
                  />

                  <PasswordInput
                    variant="filled"
                    label={t("password")}
                    placeholder={t("enterPassword")}
                    visibilityToggleIcon={VisibilityToggle}
                    defaultValue={state.password}
                    onChange={(ev) => { setState({ ...state, password: ev.target.value }) }}
                    withAsterisk={true}
                    onKeyDown={getHotkeyHandler([["Enter", login]])}
                  />

                  <Button onClick={login} radius="md">
                    {t("login")}
                  </Button>

                  {state.status === "verify" &&
                    <Alert
                      icon={<IconInfoCircle size={24} />}
                      title={t("info.text")}
                      color="blue"
                      variant="light"
                    >
                      {t("info.newLocation")}
                    </Alert>
                  }

                  {state.status === "error" &&
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

              <Flex justify="center">
                <CustomLink href="/signup">
                  <Anchor color="blue" align="center" component="div">
                    {t("dontHaveAnAccount")}
                  </Anchor>
                </CustomLink>
              </Flex>

              <Flex justify="center">
                <CustomLink href="/change-password">
                  <Anchor color="blue" align="center" component="div">
                    {t("forgotYourPassword")}
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

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}