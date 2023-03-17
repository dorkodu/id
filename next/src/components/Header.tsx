import { Flex } from "@mantine/core";
import IDIcon from "@assets/id.svg";
import Link from "next/link";
import Image from "next/image";

function Header() {

  return (
    <Flex justify="center">
      <Link href="/welcome">
        <Image src={IDIcon} alt="Dorkodu ID" width={100} height={100} />
      </Link>
    </Flex>
  )
}

export default Header