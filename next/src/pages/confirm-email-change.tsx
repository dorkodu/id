import { Alert, Anchor, Card, Flex, Text } from "@mantine/core";
import { IconAlertCircle, IconArrowLeft, IconCircleCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { fullWidth } from "../styles/css";
import { useTranslation } from "react-i18next";
import { useUserContext } from "@/stores/userContext";
import { wait } from "@/components/hooks";
import DefaultLoader from "@/components/loaders/DefaultLoader";
import CustomLink from "@/components/CustomLink";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import PageLayout from "@/layouts/PageLayout";

interface State {
  loading: boolean;
  status: boolean | undefined;
}

function ConfirmEmailChange() {
  const [state, setState] = useState<State>({ loading: false, status: undefined });

  const router = useRouter();
  const { t } = useTranslation();
  const queryConfirmEmailChange = useUserContext(state => state.queryConfirmEmailChange);

  const confirmEmailChange = async () => {
    const token = typeof router.query.token === "string" ? router.query.token : undefined;
    if (!token) return;
    if (state.loading) return;

    setState({ ...state, loading: true });
    const status = await wait(() => queryConfirmEmailChange(token))();
    setState({ ...state, loading: false, status: status });
  }

  useEffect(() => { confirmEmailChange() }, []);

  return (
    <>
      <Head>
        <title>Dorkodu ID</title>
        <meta name="title" content="Dorkodu ID" />
        <meta name="description" content="Your Digital Identity @ Dorkodu" />
      </Head>
      <main>
        <PageLayout
          title={t("route.confirmEmailChange.title")}
          description={t("route.confirmEmailChange.description")}
          content={
            <Card shadow="sm" p="md" radius="md" withBorder sx={fullWidth}>
              <Flex direction="column" gap="md">
                {state.loading && <Flex justify="center"><DefaultLoader /></Flex>}

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

                {state.status === true &&
                  <Alert
                    icon={<IconCircleCheck size={24} />}
                    title={t("success.text")}
                    color="green"
                    variant="light"
                  >
                    {t("success.emailChanged")}
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

export default ConfirmEmailChange

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}