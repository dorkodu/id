import { ActionIcon, AppShell, Card, CSSObject, Flex, Header } from "@mantine/core"
import { IconArrowLeft, IconMenu2 } from "@tabler/icons-react";
import { useAppStore } from "@/stores/appStore";
import { useRouter } from "next/router";
import CustomLink from "@/components/CustomLink";
import Image from "next/image";
import IDIcon from "@assets/id.svg";

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
  const route = useAppStore(state => state.route);

  const goBack = () => router.back();

  return (
    <Header sx={width} px="md" pt="md" height={64} withBorder={false}>
      <Card sx={{ height: "100%" }} shadow="sm" p="md" radius="md" withBorder>
        <Flex sx={{ height: "100%" }} align="center" justify="space-between">
          <ActionIcon
            color="dark"
            onClick={goBack}
            style={router.pathname !== "/dashboard" ? {} : { visibility: "hidden" }}>
            <IconArrowLeft />
          </ActionIcon>

          <CustomLink href="/">
            <ActionIcon size={32}>
              <Image
                src={IDIcon} alt="Dorkodu ID"
                width={32} height={32}
                draggable={false}
              />
            </ActionIcon>
          </CustomLink>

          <CustomLink href="/menu">
            <ActionIcon color={route === "menu" ? "green" : "dark"}>
              <IconMenu2 />
            </ActionIcon>
          </CustomLink>
        </Flex>
      </Card>
    </Header>
  )
}