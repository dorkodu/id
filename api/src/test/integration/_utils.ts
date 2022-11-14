import pg from "../../pg"

async function resetDatabase() {
  await pg.begin(pg => [
    pg`TRUNCATE TABLE users`,
    pg`TRUNCATE TABLE sessions`,
    pg`TRUNCATE TABLE email_verification`,
    pg`TRUNCATE TABLE security_verification`,
    pg`TRUNCATE TABLE security_notification`,
  ])
}

export const utils = {
  resetDatabase,
}