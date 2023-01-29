import { css } from "@emotion/react";
import { Anchor, Divider, Flex, Text } from "@mantine/core";

function Footer() {
  const links = [
    { link: "https://dorkodu.com", label: "About", },
    { link: "https://dorkodu.com/privacy", label: "Privacy", },
    { link: "https://garden.dorkodu.com", label: "Garden", },
    { link: "https://dorkodu.com/work", label: "Work", },
  ];

  const items = links.map((link) => (
    <Anchor color="dimmed" key={link.label} href={link.link} size="sm">
      {link.label}
    </Anchor>
  ));

  return (
    <Flex direction="column" align="center" gap="xs">
      <Divider css={css`width: 100%;`} />
      <Flex gap="xs">{items}</Flex>
      <Text color="dimmed" weight={450}>
        <b>Dorkodu</b> &copy; {new Date().getFullYear()}
      </Text>
    </Flex>
  )
}

export default Footer