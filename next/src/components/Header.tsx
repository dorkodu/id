import { Flex } from "@mantine/core";
import IDIcon from "@assets/id.svg";
import Image from "next/image";
import CustomLink from "./CustomLink";

function Header() {
  return (
    <Flex justify="center">
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