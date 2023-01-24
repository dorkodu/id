import {
  createStyles,
  Avatar,
  Text,
  Group,
  Alert,
  Paper,
  Stack,
} from "@mantine/core";
import {
  IconPhoneCall,
  IconAt,
  IconExclamationMark,
  IconMailOpened,
  IconCalendar,
} from "@tabler/icons";
import { FunctionComponent } from "react";
import { date } from "../lib/date";

const useStyles = createStyles((theme) => ({
  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[5],
  },
}));

