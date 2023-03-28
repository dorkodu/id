import { Alert, Anchor, Button, Card, Flex, Text, Title } from "@mantine/core";
import { IconAlertCircle, IconArrowLeft } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import OverlayLoader from "../components/loaders/OverlayLoader";
import { useWait } from "../components/hooks";
import { useAppStore } from "../stores/appStore";
import { useUserStore } from "../stores/userStore";
import { fullWidth } from "../styles/css";
import PageLayout from "@/components/layouts/PageLayout";

interface State {
  loading: boolean;
  status: boolean | undefined;

  service: string;
}

function Access() {
  const [searchParams] = useSearchParams();

  const [state, setState] = useState<State>({
    loading: false,
    status: undefined,
    service: searchParams.get("service") ?? "",
  });

  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const setRedirect = useAppStore(state => state.setRedirect);
  const queryGrantAccess = useUserStore((state) => state.queryGrantAccess);
  const authorized = useUserStore((state) => state.authorized);

  const goBack = () => navigate("/dashboard");
  const reject = async () => navigate("/dashboard");
  const accept = async () => {
    if (state.loading) return;

    setState({ ...state, loading: true });
    const code = await useWait(() => queryGrantAccess(state.service))();
    setState({ ...state, loading: false, status: !!code });

    if (!code) return;
    document.location.href = `https://${state.service}/dorkodu-id?code=${code}`;
  }

  useEffect(() => {
    if (authorized) return;
    setRedirect(`${location.pathname}${location.search}`);
    navigate("/welcome");
  }, []);

  if (!authorized) { return <></> }

  return (
    <PageLayout
      title={t("route.access.title")}
      description={t("route.access.description")}
    >
      <Card shadow="sm" p="md" radius="md" withBorder sx={fullWidth}>
        {state.loading && <OverlayLoader />}

        <Flex direction="column" gap="md">
          {state.service && authorized &&
            <>
              <Title order={4} align="center">{state.service}</Title>
              <Text>
                <Trans t={t} i18nKey="route.access.serviceRequirements" />
              </Text>

              <Button onClick={accept}>
                {t("accept")}
              </Button>

              <Button onClick={reject} variant="default">
                {t("reject")}
              </Button>
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
                <Anchor size={15} onClick={goBack}>
                  <Flex align="center" gap="xs">
                    <IconArrowLeft size={16} stroke={2.5} />
                    <Text>{t("goBack")}</Text>
                  </Flex>
                </Anchor>
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
    </PageLayout>
  )
}

export default Access;
