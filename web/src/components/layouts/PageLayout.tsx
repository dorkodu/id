import { Flex, Text, Title } from "@mantine/core";
import { widthLimit } from "../../styles/css";
import Footer from "../Footer";
import Header from "../Header";

interface Props {
  title: string;
  description: string;
}

export default function PageLayout({ title, description, children }: React.PropsWithChildren<Props>) {
  return (
    <div style={widthLimit}>
      <Flex direction="column" gap="md" mx="md">
        <Header />

        <Title order={1} align="center">
          {title}
        </Title>
        <Text color="dimmed" size="md" align="center" weight={600}>
          {description}
        </Text>

        {children}

        <Footer />
      </Flex>
    </div>
  )
}