import { Flex } from "@mantine/core";
import DorkoduIDKeyIcon from "@assets/dorkodu-id_key.svg";

function Header() {
  return (
    <Flex justify="center">
      <img src={DorkoduIDKeyIcon} width={100} height={100} />
    </Flex>
  )
}

export default Header