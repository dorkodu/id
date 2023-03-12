import { Button, Card, Divider, Flex, NativeSelect } from "@mantine/core"
import { IconLogout, IconWorld } from "@tabler/icons-react"
import { useTranslation } from "react-i18next";
import { ColorToggleSegmented } from "../components/ColorToggle";
import i18n from "../lib/i18n"
import { useAppStore } from "../stores/appStore";
import { useUserStore } from "../stores/userStore";

function Menu() {
  const { t } = useTranslation();
  const changeLocale = useAppStore(state => state.changeLocale);
  const queryLogout = useUserStore(state => state.queryLogout);

  const logout = () => { queryLogout() }

  return (
    <Card shadow="sm" p="md" m="md" radius="md" withBorder>
      <Flex direction="column" gap="md">
        <NativeSelect
          radius="md"
          variant="default"
          placeholder="language..."
          icon={<IconWorld />}
          value={i18n.language}
          onChange={(ev) => changeLocale(ev.currentTarget.value)}
          data={[
            { value: 'en', label: 'English' },
            { value: 'tr', label: 'Türkçe' },
          ]}
        />

        <ColorToggleSegmented />

        <Divider />

        <Button
          radius="md"
          fullWidth
          variant="default"
          leftIcon={<IconLogout />}
          onClick={logout}
        >
          {t("logout")}
        </Button>

      </Flex>
    </Card>
  )
}

export default Menu