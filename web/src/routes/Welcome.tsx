import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/userStore";

import {
	Paper,
	Title,
	Text,
	Container,
	Button,
	Stack,
	Box,
	Anchor,
} from "@mantine/core";

import { ReactComponent as DorkoduLogo } from "@assets/dorkodu_Logo.svg";

import { FormPage } from "../components/_shared";

function Welcome() {
	const navigate = useNavigate();

	const authorized = useUserStore((state) => state.authorized);

	return (
		<>
			{authorized && navigate("/dashboard")}
			{!authorized && (
				<Container size={460} my={25}>
					<Box
						my={60}
						style={{
							display: "flex",
							justifyContent: "center",
						}}
					>
						<DorkoduLogo width={200} height={50} />
					</Box>
					<Title order={1} align="center" mb={5}>
						Welcome
					</Title>
					<Text color="dimmed" size="md" align="center" weight={500}>
						Choose how you will enter.
					</Text>
					<Paper p={30} radius="lg" mt="md">
						<Stack>
							<Button
								variant="filled"
								onClick={() => {
									navigate("/signup");
								}}
								radius="md"
							>
								Create Account
							</Button>
							<Button
								variant="default"
								onClick={() => {
									navigate("/login");
								}}
								radius="md"
							>
								Log In
							</Button>

							<Anchor
								color="blue"
								size={15}
								weight={450}
								onClick={(e) => {
									e.preventDefault();
									navigate("/change_password");
								}}
								align="center"
								mt={10}
							>
								<Box ml={5}>Forgot your password?</Box>
							</Anchor>
						</Stack>
					</Paper>

					<FormPage.Footer />
				</Container>
			)}
		</>
	);
}

export default Welcome;
