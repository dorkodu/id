import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { useUserStore } from '@/stores/userStore'
import { Anchor, Button, Flex, Text, ThemeIcon, ThemeIconProps, Title } from '@mantine/core'
import { IconDiscountCheck, IconLock, IconUnlink, IconUser } from '@tabler/icons-react'
import Head from 'next/head'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const styles: { themeIcons: Partial<ThemeIconProps> } = {
  themeIcons: {
    variant: "light",
    size: 32,
    radius: "md",
  },
}

export default function Home() {
  const { t } = useTranslation();
  const authorized = useUserStore((state) => state.authorized);

  return (
    <>
      <Head>
        <title>Dorkodu ID</title>
        <meta name="title" content="Dorkodu ID" />
        <meta name="description" content="Your Digital Identity @ Dorkodu" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Flex>
          <Flex direction="column" gap="md" mx="md">
            <Header />

            <Title order={1} align="center">
              {t("route.welcome.title")}
            </Title>
            <Text color="dimmed" size="md" align="center" weight={600}>
              {t("route.welcome.description")}
            </Text>

            <Flex justify="center">
              <Flex direction="column" gap="md">
                {authorized &&
                  <Link href="/dashboard">
                    <Button
                      variant="filled"
                      radius="md">
                      {t("continueToDashboard")}
                    </Button>
                  </Link>
                }
                {!authorized &&
                  <>
                    <Link href="/signup">
                      <Button variant="filled" radius="md">
                        {t("createAccount")}
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button variant="default" radius="md">
                        {t("login")}
                      </Button>
                    </Link>

                    <Anchor
                      color="blue"
                      align="center"
                      href="/change-password"
                    >
                      {t("forgotYourPassword")}
                    </Anchor>
                  </>
                }
              </Flex>
            </Flex>

            <Flex justify="center">
              <Flex direction="column" gap="md">
                <Flex align="center" gap="md">
                  <ThemeIcon {...styles.themeIcons} color="cyan">
                    <IconUser />
                  </ThemeIcon>
                  {t("route.welcome.list.item1")}
                </Flex>

                <Flex align="center" gap="md">
                  <ThemeIcon {...styles.themeIcons} color="blue">
                    <IconDiscountCheck />
                  </ThemeIcon>
                  {t("route.welcome.list.item2")}
                </Flex>

                <Flex align="center" gap="md">
                  <ThemeIcon {...styles.themeIcons} color="indigo">
                    <IconLock />
                  </ThemeIcon>
                  {t("route.welcome.list.item3")}
                </Flex>

                <Flex align="center" gap="md">
                  <ThemeIcon {...styles.themeIcons} color="violet">
                    <IconUnlink />
                  </ThemeIcon>
                  {t("route.welcome.list.item4")}
                </Flex>
              </Flex>
            </Flex>

            <Footer />
          </Flex>
        </Flex>
      </main>
    </>
  )
}
