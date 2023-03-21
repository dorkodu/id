import CustomLink from "@/components/CustomLink";
import { wait } from "@/components/hooks";
import OverlayLoader from "@/components/loaders/OverlayLoader";
import { useUserContext } from "@/stores/userContext";
import { Alert, Anchor, Button, Card, Flex, Text, Title } from "@mantine/core";
import { IconAlertCircle, IconArrowLeft } from "@tabler/icons-react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import queryString from "query-string";
import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { fullWidth, widthLimit } from "../styles/css";
import { useTranslation, Trans } from 'next-i18next'
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import auth from "@/lib/api/controllers/auth";

interface State {
  loading: boolean;
  status: boolean | undefined;

  service: string;
}

function Access() {
  const router = useRouter();

  const getService = () => {
    const service = queryString.parse(router.asPath.split("?")[1] ?? "").service;
    return typeof service === "string" ? service : "";
  }

  const [state, setState] = useState<State>({
    loading: false,
    status: undefined,
    service: getService(),
  });

  const { t } = useTranslation();
  const queryGrantAccess = useUserContext((state) => state.queryGrantAccess);

  const accept = async () => {
    const service = typeof router.query.service === "string" ? router.query.service : undefined;
    if (!service) return;
    if (state.loading) return;

    setState({ ...state, loading: true });
    const code = await wait(() => queryGrantAccess(service))();
    setState({ ...state, loading: false, status: !!code });

    if (!code) return;
    document.location.href = `https://${service}/dorkodu-id?code=${code}`;
  }

  return (
    <Flex mx="md">
      <Flex direction="column" gap="md" sx={widthLimit}>
        <Header />

        <Title order={2} align="center">
          {t("route.access.title")}
        </Title>
        <Text color="dimmed" size="md" align="center" weight={500}>
          {t("route.access.description")}
        </Text>

        <Flex justify="center">
          <Card shadow="sm" p="md" radius="md" withBorder sx={fullWidth}>
            {state.loading && <OverlayLoader />}

            <Flex direction="column" gap="md">
              {state.service &&
                <>
                  <Title order={4} align="center">{state.service}</Title>
                  <Text>
                    <Trans t={t} i18nKey="route.access.serviceRequirements" />
                  </Text>

                  <Button onClick={accept} fullWidth>
                    {t("accept")}
                  </Button>

                  <CustomLink href="/dashboard">
                    <Button variant="default" fullWidth>
                      {t("reject")}
                    </Button>
                  </CustomLink>
                </>
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

              {!state.service &&
                <>
                  <Flex>
                    <CustomLink href="/dashboard">
                      <Anchor size={15} component="div">
                        <Flex align="center" gap="xs">
                          <IconArrowLeft size={16} stroke={2.5} />
                          <Text>{t("goBack")}</Text>
                        </Flex>
                      </Anchor>
                    </CustomLink>
                  </Flex>
                  <Alert
                    icon={<IconAlertCircle size={24} />}
                    title={t("error.text")}
                    color="red"
                    variant="light"
                  >
                    {t("error.accessServiceNotFound")}
                  </Alert>
                </>
              }
            </Flex>
          </Card>
        </Flex>

        <Footer />
      </Flex>
    </Flex>
  )
}

export default Access;

export const getServerSideProps: GetServerSideProps = async (props) => {
  const req = props.req as NextApiRequest;
  const res = props.res as NextApiResponse;

  const result = await auth.auth.executor({}, { req, res });
  const status = !(!result?.data || result.error);

  if (!status) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      }
    }
  }

  return {
    props: {
      ...(await serverSideTranslations(props.locale || "en", ['common'])),
    },
  }
}