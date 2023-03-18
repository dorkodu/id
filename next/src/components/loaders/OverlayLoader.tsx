import { LoadingOverlay } from "@mantine/core";
import { useDelay } from "../hooks";

interface Props {
  noDelay?: boolean;
  full?: boolean;
}

function OverlayLoader({ noDelay, full }: Props) {
  const delay = useDelay();
  if (delay && !noDelay) return null;

  return (
    <LoadingOverlay
      visible={true}
      overlayBlur={2}
      sx={{ position: full ? "fixed" : undefined }}
    />
  )
}

export default OverlayLoader