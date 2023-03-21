import CustomLink from '@/components/CustomLink';
import { wait } from '@/components/hooks';
import OverlayLoader from '@/components/loaders/OverlayLoader';
import PageLayout from '@/layouts/PageLayout'
import { Alert, Anchor, Button, Card, Flex, Text, TextInput } from '@mantine/core';
import { getHotkeyHandler } from '@mantine/hooks';
import { IconAlertCircle, IconArrowLeft, IconInfoCircle } from '@tabler/icons-react';
import Head from 'next/head'
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useUserContext } from '@/stores/userContext';

interface State {
  loading: boolean;
  status: boolean | undefined;

  username: string;
  email: string;
}

export default function Login() {
  const user = useUserContext((state) => state.user);

  const { t } = useTranslation();
  const queryInitiatePasswordChange = useUserContext((state) => state.queryInitiatePasswordChange);

  const [state, setState] = useState<State>({
    loading: false,
    status: undefined,
    username: user?.username ?? "",
    email: user?.email ?? "",
  });

  const initiateChangePassword = async () => {
    if (state.loading) return;

    setState({ ...state, loading: true });
    const status = await wait(() => queryInitiatePasswordChange(state.username, state.email))();
    setState({ ...state, loading: false, status: status });
  };

  return (
    <>
      <Head>
        <title>Dorkodu ID</title>
        <meta name="title" content="Dorkodu ID" />
        <meta name="description" content="Your Digital Identity @ Dorkodu" />
      </Head>
      <main>
        <PageLayout
          title={t("route.changePassword.title")}
          description={t("route.changePassword.description")}
          content={
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
                  label={t("username")}
                  placeholder={t("enterUsername")}
                  defaultValue={state.username}
                  onChange={(ev) => { setState({ ...state, username: ev.target.value }) }}
                  variant="filled"
                  onKeyDown={getHotkeyHandler([["Enter", initiateChangePassword]])}
                />

                <TextInput
                  label={t("email")}
                  placeholder={t("enterEmail")}
                  defaultValue={state.email}
                  onChange={(ev) => { setState({ ...state, email: ev.target.value }) }}
                  variant="filled"
                  onKeyDown={getHotkeyHandler([["Enter", initiateChangePassword]])}
                />

                <Button onClick={initiateChangePassword} radius="md">
                  {t("continue_")}
                </Button>

                {state.status === true &&
                  <Alert
                    icon={<IconInfoCircle size={24} />}
                    title={t("info.text")}
                    color="blue"
                    variant="light"
                  >
                    {t("info.changePassword")}
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

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}