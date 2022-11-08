export interface EmailType {
  notifyNewLocation: "new_location";

  confirmEmail: "confirm_email",
  confirmEmailChange: "confirm_email_change";
  revertEmailChange: "revert_email_change";
  confirmPasswordChange: "confirm_password_change";
}