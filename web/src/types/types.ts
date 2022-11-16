import type { EmailType } from "../../../api/src/types/email_type";

export const emailTypes: EmailType = {
  notifyNewLocation: "new_location",
  confirmEmail: "confirm_email",
  confirmEmailChange: "confirm_email_change",
  revertEmailChange: "revert_email_change",
  confirmPasswordChange: "confirm_password_change",
}