import { ActionIcon, Anchor, AppShell, Button, Card, createStyles, Flex, Footer, Header, Indicator, MediaQuery, Text, useMantineTheme } from "@mantine/core";
import { IconArrowLeft, IconHome, IconMenu2 } from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";
import { clickable } from "@/styles/css";
import IDBrandLight from "@/assets/id_brand-light.svg";
import IDBrandDark from "@/assets/id_brand-dark.svg";
import DorkoduLogo from "@/assets/dorkodu_logo.svg";

const useStyles = createStyles((theme) => ({
  header: {
    maxWidth: theme.breakpoints.lg,
    margin: "0 auto"
  },
  footer: {
    display: "none",
    maxWidth: theme.breakpoints.lg,
    margin: "0 auto",

    [`@media (max-width: 640px)`]: {
      display: "block",
    },
  },
  navbar: {
    width: 300,
    flexShrink: 0,
    position: "relative",

    [`@media (max-width: 1080px)`]: {
      width: 64,
    },

    [`@media (max-width: 640px)`]: {
      display: "none",
    },
  },
  aside: {
    width: 300,
    flexShrink: 0,
    position: "relative",

    [`@media (max-width: 840px)`]: {
      width: 200,
    },

    [`@media (max-width: 768px)`]: {
      display: "none",
    },
  },
}));

export default function DefaultLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <AppShell
        header={<DefaultHeader />}
        footer={<DefaultFooter />}
        padding={0}
      >
        <Flex direction="row">
          <DefaultNavbar />
          <Flex direction="column" style={{ flexGrow: 1 }}>{children}</Flex>
          <DefaultAside />
        </Flex>
      </AppShell>
    </>
  )
}

function DefaultHeader() {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Header className={classes.header} px="md" pt="md" height={64} withBorder={false}>
      <Card sx={{ height: "100%" }} shadow="sm" radius="md" withBorder>
        <Flex sx={{ height: "100%" }} align="center" justify="space-between">
          <ActionIcon
            color="dark"
            onClick={() => navigate(-1)}
            sx={location.pathname === "/dashboard" ? { visibility: "hidden" } : undefined}>
            <IconArrowLeft />
          </ActionIcon>

          <img
            src={theme.colorScheme === "dark" ? IDBrandLight : IDBrandDark}
            alt="Dorkodu ID"
            height={32}
            draggable={false}
            style={clickable}
            onClick={() => navigate("/home")}
          />

          <ActionIcon
            color={location.pathname === "/menu" ? "green" : "dark"}
            onClick={() => navigate("/menu")}
          >
            <IconMenu2 />
          </ActionIcon>
        </Flex>
      </Card>
    </Header>
  )
}

function DefaultFooter() {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Footer className={classes.footer} px="md" pb="md" height={64} withBorder={false}>
      <Card sx={{ height: "100%" }} shadow="sm" p="md" radius="md" withBorder>
        <Flex sx={{ height: "100%" }} align="center" justify="space-evenly">

          <ActionIcon
            color={location.pathname === "/" ? "green" : "dark"}
            onClick={() => navigate("/dashboard")}
          >
            <IconHome />
          </ActionIcon>

        </Flex>
      </Card>
    </Footer>
  )
}

function DefaultNavbar() {
  const { classes } = useStyles();

  return (
    <Flex direction="column" w={300} className={classes.navbar}>
      <div style={{ position: "fixed", width: "inherit" }}>
        <Flex direction="column" py="md" pl="md" gap="xs">
          <ButtonNavbar icon={<IconHome />} path={"/dashboard"} name={"Dashboard"} />
        </Flex>
      </div>
    </Flex>
  )
}

function DefaultAside() {
  const { classes } = useStyles();

  return (
    <Flex direction="column" w={300} className={classes.aside}>
      <div style={{ position: "fixed", width: "inherit" }}>
        <Flex direction="column" py="md" pr="md" gap="xs">
          <Card withBorder>
            <Flex direction="column" gap="md" align="center">

              <Anchor href="https://dorkodu.com" align="center">
                <img
                  src={DorkoduLogo}
                  alt="Dorkodu"
                  draggable={false}
                  style={{ width: "75%" }}
                />
              </Anchor>

              <Text color="dimmed" weight={450}>
                <b>Dorkodu</b> &copy; {new Date().getFullYear()}
              </Text>

            </Flex>
          </Card>
        </Flex>
      </div>
    </Flex>
  )
}

interface ButtonProps {
  icon: React.ReactNode;
  path: string;
  name: string;
  data?: { notification?: boolean };
}

function ButtonNavbar({ icon, path, name, data }: ButtonProps) {
  return (
    <>
      <MediaQuery query="(max-width: 1080px)" styles={{ display: 'none' }}>
        <ButtonDesktop icon={icon} name={name} path={path} data={data} />
      </MediaQuery>

      <MediaQuery query="(max-width: 1080px)" styles={{ display: 'block !important' }}>
        <ButtonMobile icon={icon} path={path} data={data} style={{ display: "none" }} />
      </MediaQuery>
    </>
  )
}

interface ButtonDesktopProps extends React.ComponentPropsWithoutRef<"button"> {
  icon: React.ReactNode;
  path: string;
  name: string;
  data?: { notification?: boolean };
}

function ButtonDesktop({ icon, path, name, data, ...props }: ButtonDesktopProps) {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Button
      styles={{ label: { display: "flex", gap: theme.spacing.md, flexGrow: 1 } }}
      fullWidth
      variant="subtle"
      color={location.pathname === path ? "green" : "dark"}
      onClick={() => navigate(path)}
      {...props}
    >
      <Indicator color="red" disabled={!data?.notification} zIndex={101}>
        {icon}
      </Indicator>
      <Text truncate>{name}</Text>
    </Button>
  )
}

interface ButtonMobileProps extends React.ComponentPropsWithoutRef<"button"> {
  icon: React.ReactNode;
  path: string;
  data?: { notification?: boolean };
}

function ButtonMobile({ icon, path, data, style, ...props }: ButtonMobileProps) {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <ActionIcon
      size={24}
      color={location.pathname === path ? "green" : "dark"}
      onClick={() => navigate(path)}
      style={{ marginLeft: theme.spacing.md, width: "32px", height: "32px", ...style }}
      {...props}
    >
      <Flex direction="column" align="center" justify="center">
        <Indicator color="red" disabled={!data?.notification} zIndex={101}>
          {icon}
        </Indicator>
      </Flex>
    </ActionIcon>
  )
}