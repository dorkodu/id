import { Anchor, Flex, Text, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

function NotFound() {
  const navigate = useNavigate();
  const goBack = () => navigate("/dashboard");

  return (
    <Flex direction="column" gap="md">
      <Header />

      <Title order={1} size="h2" align="center">
        404
      </Title>
      <Text color="dimmed" size="md" weight={500} align="center">
        Couldn't find the thing you are looking for.
      </Text>

      <Flex justify="center">
        <Anchor size={15} onClick={goBack}>
          <Flex align="center" gap="xs">
            <IconArrowLeft size={16} stroke={2.5} />
            <Text>Go Back</Text>
          </Flex>
        </Anchor>
      </Flex>

      <Footer />
    </Flex>
  )
}

export default NotFound