import CustomLink from '@/components/CustomLink'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { useUserStore } from '@/stores/userStore'
import { fullWidth, themeIcon, widthLimit } from '@/styles/css'
import { Anchor, Button, Flex, Text, ThemeIcon, Title } from '@mantine/core'
import { IconDiscountCheck, IconLock, IconUnlink, IconUser } from '@tabler/icons-react'
import Head from 'next/head'
import { useTranslation } from 'react-i18next'

export default function Home() {
  const { t } = useTranslation();
  const authorized = useUserStore((state) => state.authorized);

  return (
    <>
      <Head>
        <title>Dorkodu ID</title>
        <meta name="title" content="Dorkodu ID" />
        <meta name="description" content="Your Digital Identity @ Dorkodu" />
      </Head>
      <Flex sx={widthLimit}>
        <Flex direction="column" gap="md" mx="md">
          <Header />

          <Title order={1} align="center">
            {t("route.welcome.title")}
          </Title>
          <Text color="dimmed" size="md" align="center" weight={600}>
            {t("route.welcome.description")}
          </Text>

          <Flex justify="center">
            <Flex direction="column" gap="md" sx={fullWidth}>
              {authorized &&
                <Button
                  variant="filled"
                  radius="md">
                  <CustomLink href="/dashboard">
                    {t("continueToDashboard")}
                  </CustomLink>
                </Button>
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

          <Footer />
        </Flex>
      </Flex>
    </>
  )
}
