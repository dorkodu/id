import { Flex } from "@mantine/core";
import IDIcon from "@/../public/id_key.svg";
import Image from "next/image";
import CustomLink from "./CustomLink";

function Header() {
  return (
    <Flex justify="center" mb="-md">
      <CustomLink href="/">
        <Image
          src={IDIcon}
          alt="Dorkodu ID"
          width={100}
          height={100}
          draggable={false}
        />
      </CustomLink>
    </Flex>
  )
}

export default Header