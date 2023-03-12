import { Flex } from "@mantine/core";
import IDIcon from "@assets/id.svg";
import { useNavigate } from "react-router-dom";
import { clickable } from "../styles/css";

function Header() {
  const navigate = useNavigate();

  const gotoWelcome = () => navigate("/welcome");

  return (
    <Flex justify="center" >
      <img
        src={IDIcon}
        alt="Dorkodu ID"
        width={100}
        height={100}
        onClick={gotoWelcome}
        css={clickable}
      />
    </Flex>
  )
}

export default Header