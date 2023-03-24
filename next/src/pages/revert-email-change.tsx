import { Alert, Anchor, Card, Flex, Text } from "@mantine/core";
import { IconAlertCircle, IconArrowLeft, IconCircleCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { widthLimit } from "../styles/css";
import { useTranslation } from "next-i18next";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/router";
import PageLayout from "@/layouts/PageLayout";
import CustomLink from "@/components/CustomLink";
import DefaultLoader from "@/components/loaders/DefaultLoader";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

interface State {
  loading: boolean;
  status: boolean | undefined;
}

function RevertChangeEmail() {
  const [state, setState] = useState<State>({
    loading: false,
    status: undefined,
  });

  const router = useRouter();
  const { t } = useTranslation();
  const queryRevertEmailChange = useUserStore(state => state.queryRevertEmailChange);

  const revertEmailChange = async () => {
    const token = typeof router.query.token === "string" ? router.query.token : undefined;
    if (!token) return;
    if (state.loading) return;

    setState({ ...state, loading: true });
    const status = await queryRevertEmailChange(token);
    setState({ ...state, loading: false, status: status });
  }

  useEffect(() => { revertEmailChange() }, []);

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
            <Card shadow="sm" p="md" radius="md" withBorder sx={widthLimit}>
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
                    {t("success.emailReverted")}
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

export default RevertChangeEmail

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}