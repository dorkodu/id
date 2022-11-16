export enum EmailTypes {
  // Used with email_token
  ConfirmEmailChange = "confirm_email_change",
  RevertEmailChange = "revert_email_change",
  ConfirmPasswordChange = "confirm_password_change",

  // Used with email_otp
  ConfirmEmail = "confirm_email",
}