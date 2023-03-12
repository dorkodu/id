import { IconEye, IconEyeOff } from "@tabler/icons-react";

interface VisibilityToggleIconProps {
  reveal: boolean;
  size: number;
}

export function VisibilityToggleIcon({ reveal, size }: VisibilityToggleIconProps) {
  return (
    reveal ?
      <IconEyeOff size={size} stroke={2.5} /> :
      <IconEye size={size} stroke={2.5} />
  )
}