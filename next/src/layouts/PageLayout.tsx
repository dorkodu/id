import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { widthLimit } from "@/styles/css";
import { Flex, Text, Title } from "@mantine/core";

interface Props {
  title: string;
  description: string;
  content: React.ReactNode;
}

function PageLayout({ title, description, content }: Props) {
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

        {content}

        <Footer />
      </Flex>
    </div>
  )
}

export default PageLayout