import { Loader as MantineLoader } from "@mantine/core";
import { useDelay } from "../hooks";

function Loader() {
  const delay = useDelay();
  if (delay) return null;

  return <MantineLoader variant="dots" color="green" />
}

export default Loader