import { ActionIcon, AppShell, Card, CSSObject, Flex, Header, useMantineTheme } from "@mantine/core"
import { IconArrowLeft, IconMenu2 } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../stores/appStore";
import IDBrandLight from "@/assets/id_brand-light.svg";
import IDBrandDark from "@/assets/id_brand-dark.svg";

const width = { maxWidth: "768px", margin: "0 auto" } satisfies CSSObject

export default function DashboardLayout({ children }: React.PropsWithChildren) {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const route = useAppStore(state => state.route);

  const routeMenu = () => { navigate("/menu") };
  const gotoWelcome = () => navigate("/welcome");
  const goBack = () => navigate(-1);

  const LayoutHeader = () => {
    return (
      <Header sx={width} px="md" pt="md" height={64} withBorder={false}>
        <Card sx={{ height: "100%" }} shadow="sm" p="md" radius="md" withBorder>
          <Flex sx={{ height: "100%" }} align="center" justify="space-between">
            <ActionIcon
              color="dark"
              onClick={goBack}
              sx={location.pathname === "/dashboard" ? { visibility: "hidden" } : undefined}>
              <IconArrowLeft />
            </ActionIcon>

            <ActionIcon size={64}>
              <img
                src={theme.colorScheme === "dark" ? IDBrandLight : IDBrandDark}
                alt="Dorkodu ID"
                width={64} height={64}
                onClick={gotoWelcome}
                draggable={false}
              />
            </ActionIcon>

            <ActionIcon
              color={route === "menu" ? "green" : "dark"}
              onClick={routeMenu}
            >
              <IconMenu2 />
            </ActionIcon>
          </Flex>
        </Card>
      </Header>
    )
  }

  return (
    <AppShell padding={0} header={<LayoutHeader />}>
      {children}
    </AppShell>
  )
}