import { IconEye, IconEyeOff } from "@tabler/icons-react";

interface VisibilityToggleProps {
  reveal: boolean;
  size: string | number;
}

export function VisibilityToggle({ reveal, size }: VisibilityToggleProps) {
  return (
    reveal ?
      <IconEyeOff size={size} stroke={2.5} /> :
      <IconEye size={size} stroke={2.5} />
  )
}