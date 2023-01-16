import {
	Alert,
	Anchor,
	Box,
	Button,
	Center,
	Container,
	createStyles,
	Group,
	Paper,
	PasswordInput,
	Space,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import {
	IconArrowLeft,
	IconEye,
	IconEyeOff,
	IconInfoSquare,
} from "@tabler/icons";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FormPage } from "../components/_shared";
import { useUserStore } from "../stores/userStore";

const useStyles = createStyles((theme) => ({
	controls: {
		[theme.fn.smallerThan("xs")]: {
			flexDirection: "column-reverse",
		},
	},

	control: {
		[theme.fn.smallerThan("xs")]: {
			width: "100%",
			textAlign: "center",
		},
	},
}));

function Login() {
	const { classes: styles } = useStyles();

	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const queryLogin = useUserStore((state) => state.queryLogin);
	const queryVerifyLogin = useUserStore((state) => state.queryVerifyLogin);

	const initialStage = searchParams.get("token") ? "verify" : "login";
	const [stage, setStage] = useState<"login" | "verify" | "confirm">(
		initialStage
	);
	const [status, setStatus] = useState<boolean | undefined>(undefined);

	const loginInfo = useRef<HTMLInputElement>(null);
	const loginPassword = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (stage === "verify") verifyLogin();
	}, []);

	const login = async () => {
		const info = loginInfo.current?.value;
		const password = loginPassword.current?.value;
		if (!info || !password) return;
		const res = await queryLogin(info, password);
		if (res === "error") return;
		if (res === "confirm") {
			setStage("confirm");
			return;
		}

		const redirect = searchParams.get("redirect");
		if (!redirect) navigate("/dashboard");
		else navigate(redirect);
	};

	const verifyLogin = async () => {
		const token = searchParams.get("token");
		if (!token) return;

		const verified = await queryVerifyLogin(token);
		setStatus(verified);
	};

	return (
		<>
			{stage !== "verify" && (
				<Container size={460} my={25}>
					<FormPage.Header />

					<Title order={2} align="center" mb={5}>
						Log In
					</Title>
					<Text color="dimmed" size="md" align="center" weight={500}>
						Forgot your password? No worries.
					</Text>

					<Paper withBorder shadow="sm" p={30} radius="lg" mt="xl">
						<TextInput
							label="Username or Email"
							placeholder="@username"
							radius="md"
							variant="filled"
							ref={loginInfo}
							type={"text"}
							disabled={stage === "confirm"}
							required
						/>
						<Space h="md" />

						<PasswordInput
							placeholder="Password"
							label="Password"
							description="Password"
							withAsterisk
							defaultValue="secret"
							visibilityToggleIcon={({ reveal, size }) =>
								reveal ? <IconEyeOff size={size} /> : <IconEye size={size} />
							}
						/>

						<Group position="apart" mt="lg" className={styles.controls}>
							<Anchor
								color="blue"
								size={15}
								onClick={(e) => {
									e.preventDefault();
									navigate("/welcome");
								}}
								className={styles.control}
							>
								<Center inline>
									<IconArrowLeft size={16} stroke={2.5} />
									<Box ml={5}>Go Back</Box>
								</Center>
							</Anchor>

							<Button className={styles.control} onClick={login} radius="md">
								Change Password
							</Button>
						</Group>
						{done && (
							<Alert
								icon={<IconInfoSquare size={24} />}
								title="Info"
								color="blue"
								variant="light"
							>
								Mail is sent. Please check your inbox.
							</Alert>
						)}
					</Paper>

					<Space h={64} />

					<FormPage.Footer />
				</Container>
			)}
			{stage === "verify" && (
				<>
					{stage === "verify" && status === undefined && <>loading...</>}
					{stage === "verify" && status === true && <>verified.</>}
					{stage === "verify" && status === false && <>couldn't verify.</>}
				</>
			)}
		</>
	);
}

export default Login;
