import { Alert, Anchor, Button, Card, Flex, Text, TextInput } from "@mantine/core";
import { IconAlertCircle, IconArrowLeft, IconAt, IconInfoCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { fullWidth } from "../styles/css";
import { useTranslation } from "next-i18next";
import InputRequirements, { getRequirement, getRequirementError } from "../components/popovers/InputRequirements";
import { getHotkeyHandler, useFocusWithin } from "@mantine/hooks";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import auth from "@/lib/api/controllers/auth";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useUserContext } from "@/stores/userContext";
import { wait } from "@/components/hooks";
import CustomLink from "@/components/CustomLink";
import OverlayLoader from "@/components/loaders/OverlayLoader";
import Head from "next/head";
import PageLayout from "@/layouts/PageLayout";

interface State {
  loading: boolean;
  status: boolean | undefined;

  email: string;
}

function ChangeEmail() {
  const [state, setState] = useState<State>({ loading: false, status: undefined, email: "" });

  const { t } = useTranslation();
  const queryInitiateEmailChange = useUserContext(state => state.queryInitiateEmailChange);

  const initiateEmailChange = async () => {
    if (state.loading) return;

    setState({ ...state, loading: true });
    const status = await wait(() => queryInitiateEmailChange(state.email))();
    setState({ ...state, loading: false, status: status });
  }

  // Necessary stuff for input validation & error messages
  const [inputReady, setInputReady] = useState(false);
  const { ref, focused } = useFocusWithin();
  useEffect(() => { setInputReady(focused || inputReady) }, [focused]);

  return (
    <>
      <Head>
        <title>Dorkodu ID</title>
        <meta name="title" content="Dorkodu ID" />
        <meta name="description" content="Your Digital Identity @ Dorkodu" />
      </Head>
      <main>
        <PageLayout
          title={t("route.changeEmail.title")}
          description={t("route.changeEmail.description")}
          content={
            <Card shadow="sm" p="md" radius="md" withBorder sx={fullWidth}>
              {state.loading && <OverlayLoader />}

              <Flex direction="column" gap="md">
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

                <InputRequirements
                  value={state.email}
                  requirements={getRequirement(t, "email")}
                >
                  <TextInput
                    label={t("newEmail")}
                    placeholder={t("enterNewEmail")}
                    defaultValue={state.email}
                    onChange={(ev) => { setState({ ...state, email: ev.target.value }) }}
                    radius="md"
                    variant="filled"
                    icon={<IconAt size={16} />}
                    type={"email"}
                    error={inputReady && getRequirementError(t, "email", state.email, focused)}
                    ref={ref}
                    onKeyDown={getHotkeyHandler([["Enter", initiateEmailChange]])}
                  />
                </InputRequirements>

                <Button onClick={initiateEmailChange} radius="md">
                  {t("continue_")}
                </Button>

                {state.status === true &&
                  <Alert
                    icon={<IconInfoCircle size={24} />}
                    title={t("info.text")}
                    color="blue"
                    variant="light"
                  >
                    {t("info.changeEmail")}
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

export default ChangeEmail

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