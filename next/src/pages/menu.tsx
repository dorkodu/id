import auth from "@/lib/api/controllers/auth";
import { Button, Card, Divider, Flex } from "@mantine/core"
import { IconLogout } from "@tabler/icons-react"
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { ColorToggleSegmented } from "../components/ColorToggle";
import { useUserStore } from "@/stores/userStore";
import LanguagePicker from "@/components/LanguagePicker";
import DashboardLayout from "@/layouts/DashboardLayout";
import Head from "next/head";

function Menu() {
  const { t } = useTranslation();
  const queryLogout = useUserStore(state => state.queryLogout);

  const logout = () => { queryLogout() }

  return (
    <>
      <Head>
        <title>Dorkodu ID</title>
        <meta name="title" content="Dorkodu ID" />
        <meta name="description" content="Your Digital Identity @ Dorkodu" />
      </Head>
      <main>
        <DashboardLayout>
          <Card shadow="sm" p="md" m="md" radius="md" withBorder>
            <Flex direction="column" gap="md">
              <LanguagePicker />

              <ColorToggleSegmented />

              <Divider />

              <Button
                radius="md"
                fullWidth
                variant="default"
                leftIcon={<IconLogout />}
                onClick={logout}
              >
                {t("logout")}
              </Button>

            </Flex>
          </Card>
        </DashboardLayout>
      </main>
    </>
  )
}

export default Menu

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