import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import CustomLink from '@/components/CustomLink'
import PageLayout from '@/layouts/PageLayout'
import { themeIcon } from '@/styles/css'
import { Anchor, Button, Flex, ThemeIcon } from '@mantine/core'
import { IconDiscountCheck, IconLock, IconUnlink, IconUser } from '@tabler/icons-react'
import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { useUserStore } from '@/stores/userStore'

export default function Home() {
  const { t } = useTranslation("common");
  const authorized = useUserStore((state) => state.authorized);

  return (
    <>
      <Head>
        <title>Dorkodu ID</title>
        <meta name="title" content="Dorkodu ID" />
        <meta name="description" content="Your Digital Identity @ Dorkodu" />
      </Head>
      <main>
        <PageLayout
          title={t("route.welcome.title")}
          description={t("route.welcome.description")}
          content={
            <>
              <Flex direction="column" gap="md">
                {authorized &&
                  <CustomLink href="/dashboard">
                    <Button variant="filled" radius="md" fullWidth>
                      {t("continueToDashboard")}
                    </Button>
                  </CustomLink>
                }
                {!authorized &&
                  <>
                    <CustomLink href="/signup">
                      <Button variant="filled" radius="md" fullWidth>
                        {t("createAccount")}
                      </Button>
                    </CustomLink>
                    <CustomLink href="/login">
                      <Button variant="default" radius="md" fullWidth>
                        {t("login")}
                      </Button>
                    </CustomLink>

                    <Flex justify="center">
                      <CustomLink href="/change-password">
                        <Anchor color="blue" align="center" component="div">
                          {t("forgotYourPassword")}
                        </Anchor>
                      </CustomLink>
                    </Flex>
                  </>
                }
              </Flex>

              <Flex justify="center">
                <Flex direction="column" gap="md">
                  <Flex align="center" gap="md">
                    <ThemeIcon {...themeIcon} color="cyan">
                      <IconUser />
                    </ThemeIcon>
                    {t("route.welcome.list.item1")}
                  </Flex>

                  <Flex align="center" gap="md">
                    <ThemeIcon {...themeIcon} color="blue">
                      <IconDiscountCheck />
                    </ThemeIcon>
                    {t("route.welcome.list.item2")}
                  </Flex>

                  <Flex align="center" gap="md">
                    <ThemeIcon {...themeIcon} color="indigo">
                      <IconLock />
                    </ThemeIcon>
                    {t("route.welcome.list.item3")}
                  </Flex>

                  <Flex align="center" gap="md">
                    <ThemeIcon {...themeIcon} color="violet">
                      <IconUnlink />
                    </ThemeIcon>
                    {t("route.welcome.list.item4")}
                  </Flex>
                </Flex>
              </Flex>
            </>
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