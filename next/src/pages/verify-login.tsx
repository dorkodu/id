import CustomLink from '@/components/CustomLink'
import { wait } from '@/components/hooks'
import OverlayLoader from '@/components/loaders/OverlayLoader'
import PageLayout from '@/layouts/PageLayout'
import { useUserStore } from '@/stores/userStore'
import { Alert, Anchor, Card, Flex, Text } from '@mantine/core'
import { IconAlertCircle, IconArrowLeft, IconCircleCheck } from '@tabler/icons-react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'

interface State {
  loading: boolean;
  status: undefined | "verify" | "error" | "ok";

  token: string | undefined;
}

export default function VerifyLogin() {
  const router = useRouter();
  const { query } = router;
  const token: State["token"] = typeof query.token === "string" ? query.token : undefined;

  const [state, setState] = useState<State>({
    loading: true,
    status: undefined,
    token: token,
  });

  const { t } = useTranslation();
  const queryVerifyLogin = useUserStore((state) => state.queryVerifyLogin);

  const verifyLogin = async () => {
    setState({ ...state, loading: true });
    const status = await wait(() => queryVerifyLogin(state.token))();
    setState({ ...state, loading: false, status: status ? "ok" : "error" });
  }

  useEffect(() => { verifyLogin() }, []);

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
            <Card shadow="sm" p="md" radius="md" withBorder>
              {state.loading && <OverlayLoader noDelay />}

              <Flex direction="column" gap="md">
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
              </Flex>
            </Card>
          }
        />
      </main>
    </>
  )
}
