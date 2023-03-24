import { ActionIcon, AppShell, Card, CSSObject, Flex, Header, useMantineTheme } from "@mantine/core"
import { IconArrowLeft, IconMenu2 } from "@tabler/icons-react";
import { useRouter } from "next/router";
import CustomLink from "@/components/CustomLink";
import Image from "next/image";
import IDBrandLight from "@/../public/id_brand-light.svg";
import IDBrandDark from "@/../public/id_brand-dark.svg";

const width = { maxWidth: "768px", margin: "0 auto" } satisfies CSSObject

function DashboardLayout({ children }: React.PropsWithChildren) {
  return (
    <AppShell padding={0} header={<LayoutHeader />}>
      {children}
    </AppShell>
  )
}

export default DashboardLayout

function LayoutHeader() {
  const router = useRouter();
  const theme = useMantineTheme();
  const image = theme.colorScheme === "light" ? IDBrandDark : IDBrandLight;

  return (
    <Header sx={width} px="md" pt="md" height={64} withBorder={false}>
      <Card sx={{ height: "100%" }} shadow="sm" p="md" radius="md" withBorder>
        <Flex sx={{ height: "100%" }} align="center" justify="space-between">
          <ActionIcon
            color="dark"
            onClick={() => router.back()}
            style={router.pathname !== "/dashboard" ? {} : { visibility: "hidden" }}>
            <IconArrowLeft />
          </ActionIcon>

          <CustomLink href="/">
            <ActionIcon w={image.width / 7.5} h={image.height / 7.5}>
              <Image
                src={image.src}
                alt="Dorkodu ID"
                width={image.width / 7.5} height={image.height / 7.5}
                draggable={false}
              />
            </ActionIcon>
          </CustomLink>

          <CustomLink href="/menu">
            <ActionIcon color={router.pathname === "/menu" ? "green" : "dark"}>
              <IconMenu2 />
            </ActionIcon>
          </CustomLink>
        </Flex>
      </Card>
    </Header>
  )
}