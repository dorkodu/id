import PageLayout from "@/layouts/PageLayout";
import { Anchor, Flex, Text } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import CustomLink from "@/components/CustomLink";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

function Page500() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>Dorkodu ID</title>
        <meta name="title" content="Dorkodu ID" />
        <meta name="description" content="Your Digital Identity @ Dorkodu" />
      </Head>
      <main>
        <PageLayout
          title={t("route.404.title")}
          description={t("route.404.description")}
          content={
            <Flex justify="center">
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
        />
      </main>
    </>
  )
}

export default Page500

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}