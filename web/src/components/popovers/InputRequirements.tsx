import { Flex, Popover, Text } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { TFunction } from "i18next";
import { useState } from "react";

interface Props {
  children: React.ReactNode;
  requirements: { req: RegExp, label: string, hidden?: boolean }[];
  value: string;
}

function InputRequirements({ children, requirements, value }: Props) {
  const [popoverOpened, setPopoverOpened] = useState(false);
  const checks = requirements.map((requirement, index) => (
    !requirement.req.test(value) && (
      (requirement.hidden && value.length !== 0) || !requirement.hidden
    ) ?
      <Requirement key={index} label={requirement.label} /> :
      null
  )).filter(Boolean);

  return (
    <Popover opened={popoverOpened} position="bottom" width="target" transition="pop">
      <Popover.Target>
        <div
          onFocusCapture={() => setPopoverOpened(true)}
          onBlurCapture={() => setPopoverOpened(false)}
        >
          {children}
        </div>
      </Popover.Target>
      {checks.length !== 0 && <Popover.Dropdown>{checks}</Popover.Dropdown>}
    </Popover>
  )
}

export default InputRequirements

function Requirement({ label }: { label: string }) {
  return (
    <Text color="red" size="sm">
      <Flex direction="row" align="center" gap="xs">
        <IconX size={14} style={{ flexShrink: 0 }} />
        {label}
      </Flex>
    </Text>
  )
}

type Requirement = "name" | "username" | "bio" | "email" | "password";

export function getRequirement(t: TFunction<"common", undefined>, requirement: Requirement) {
  switch (requirement) {
    case "name":
      return [
        { req: /^.{1,64}$/, label: t("requirements.nameLength") },
      ]
    case "username":
      return [
        { req: /^.{1,16}$/, label: t("requirements.usernameLength") },
        { req: /^[a-zA-Z0-9._]*$/, label: t("requirements.usernameChars"), hidden: true },
        { req: /^(?![_.])(?!.*[_.]{2}).+(?<![_.])$/, label: t("requirements.usernameAvoid"), hidden: true },
      ]
    case "bio":
      return [
        { req: /^[\s\S]{0,500}$/s, label: t("requirements.bioLength"), hidden: true },
      ]
    case "email":
      return [
        { req: /.{1,}/, label: t("requirements.emailEmpty") },
        { req: /^.{0,320}$/, label: t("requirements.emailLength"), hidden: true },
      ]
    case "password":
      return [
        { req: /^.{8,}$/, label: t("requirements.passwordLength") },
      ]
  }
}

export function getRequirementError(
  t: TFunction<"common", undefined>,
  requirement: Requirement,
  value: string,
  boolean?: boolean,
) {
  const requirements = getRequirement(t, requirement);

  for (let i = 0; i < requirements.length; ++i) {
    const r = requirements[i];
    if (!r) continue;
    if (!r.req.test(value)) return boolean ? true : r.label;
  }

  return null;
}