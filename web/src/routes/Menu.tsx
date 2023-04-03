import LanguagePicker from "@/components/LanguagePicker";
import { Button, Card, Divider, Flex } from "@mantine/core"
import { IconLogout } from "@tabler/icons-react"
import { useTranslation } from "react-i18next";
import { ColorToggleSegmented } from "../components/ColorToggle";
import { useUserStore } from "../stores/userStore";

function Menu() {
  const { t } = useTranslation();
  const queryLogout = useUserStore(state => state.queryLogout);

  const logout = () => { queryLogout() }

  return (
    <Card shadow="sm" p="md" m="md" radius="md" withBorder>
      <Flex direction="column" gap="md">
        <LanguagePicker />

        <ColorToggleSegmented />

        <Divider />

        <Button radius="md" fullWidth variant="default" leftIcon={<IconLogout />} onClick={logout}>
          {t("logout")}
        </Button>

      </Flex>
    </Card>
  )
}

export default Menu