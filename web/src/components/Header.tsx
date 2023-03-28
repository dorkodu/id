import { Flex } from "@mantine/core";
import IDIcon from "@assets/id.svg";
import { useNavigate } from "react-router-dom";
import { clickable } from "../styles/css";

function Header() {
  const navigate = useNavigate();

  return (
    <Flex justify="center" mb="-md">
      <img
        src={IDIcon}
        alt="Dorkodu ID"
        width={100}
        height={100}
        onClick={() => navigate("/welcome")}
        style={clickable}
      />
    </Flex>
  )
}

export default Header