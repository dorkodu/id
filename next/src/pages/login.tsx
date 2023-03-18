import CustomLink from '@/components/CustomLink'
import { useWait } from '@/components/hooks'
import OverlayLoader from '@/components/loaders/OverlayLoader'
import { VisibilityToggle } from '@/components/VisibilityToggle'
import PageLayout from '@/layouts/PageLayout'
import { useAppStore } from '@/stores/appStore'
import { useUserStore } from '@/stores/userStore'
import { Alert, Anchor, Button, Card, Flex, PasswordInput, Text, TextInput } from '@mantine/core'
import { getHotkeyHandler } from '@mantine/hooks'
import { IconAlertCircle, IconArrowLeft, IconCircleCheck, IconInfoCircle } from '@tabler/icons-react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface State {
  loading: boolean;
  status: undefined | "verify" | "error" | "ok";

  info: string;
  password: string;
  token: string | undefined;

  stage: "login" | "verify";
}

export default function Login() {
  const router = useRouter();
  const { query } = router;
  const token: State["token"] = typeof query.token === "string" ? query.token : undefined;

  const [state, setState] = useState<State>({
    loading: false,
    status: undefined,
    info: "",
    password: "",
    token: token,
    stage: token ? "verify" : "login",
  });

  const { t } = useTranslation();
  const queryLogin = useUserStore((state) => state.queryLogin);
  const queryVerifyLogin = useUserStore((state) => state.queryVerifyLogin);

  const login = async () => {
    if (state.loading) return;

    setState({ ...state, loading: true });
    const status = await useWait(() => queryLogin(state.info, state.password))();
    setState({ ...state, loading: false, status: status });

    if (status !== "ok") return;

    const redirect = useAppStore.getState().redirect;
    if (!redirect) router.push("/dashboard");
    else router.push(redirect);
  }

  const verifyLogin = async () => {
    if (state.loading) return;

    setState({ ...state, loading: true });
    const status = await useWait(() => queryVerifyLogin(state.token))();
    setState({ ...state, loading: false, status: status ? "ok" : "error" });
  }

  const loginStage = () => {
    return (
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
      </>
    )
  }

  const verifyLoginStage = () => {
    return (
      <>
        {!state.loading &&
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
        }

        {state.status === "ok" &&
          <Alert
            icon={<IconCircleCheck size={24} />}
            title={t("success.text")}
            color="green"
            variant="light"
          >
            {t("success.locationVerified")}
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
      </>
    )
  }

  useEffect(() => { state.stage === "verify" && verifyLogin() }, []);

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
                  {/*Use Component() instead of <Component /> to avoid state-loss*/}
                  {state.stage === "login" && loginStage()}
                  {state.stage === "verify" && verifyLoginStage()}
                </Flex>
              </Card>

              {state.stage !== "verify" &&
                <>
                  <CustomLink href="/signup">
                    <Anchor color="blue" align="center" component="div">
                      {t("dontHaveAnAccount")}
                    </Anchor>
                  </CustomLink>


                  <CustomLink href="/change-password">
                    <Anchor color="blue" align="center" component="div">
                      {t("forgotYourPassword")}
                    </Anchor>
                  </CustomLink>
                </>
              }
            </>
          }
        />
      </main>
    </>
  )
}
