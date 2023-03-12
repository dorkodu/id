import { css } from "@emotion/react";
import { ActionIcon, AppShell, Card, Flex, Header } from "@mantine/core"
import IDIcon from "@assets/id.svg";
import { IconArrowLeft, IconMenu2 } from "@tabler/icons-react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppStore } from "../../stores/appStore";

const width = css`
  max-width: 768px;
  margin: 0 auto;
`;
function DefaultLayout() {
  const navigate = useNavigate();
  const route = useAppStore(state => state.route);

  const routeMenu = () => { navigate("/menu") };
  const gotoWelcome = () => navigate("/welcome");
  const goBack = () => navigate(-1);

  const LayoutHeader = () => {
    return (
      <Header css={width} px="md" pt="md" height={64} withBorder={false}>
        <Card css={css`height:100%;`} shadow="sm" p="md" radius="md" withBorder>
          <Flex css={css`height:100%;`} align="center" justify="space-between">
            <ActionIcon
              color="dark"
              onClick={goBack}
              css={location.pathname !== "/dashboard" ? css`` : css`visibility: hidden;`}>
              <IconArrowLeft />
            </ActionIcon>

            <ActionIcon size={32}>
              <img
                src={IDIcon} alt="Dorkodu ID"
                width={32} height={32}
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
      <Outlet />
    </AppShell>
  )
}

export default DefaultLayout