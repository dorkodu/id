import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("email_verify_email", (table) => {
      table.bigIncrements("id").primary()
      table.string("username", 16)
      table.string("email", 320)
      table.integer("otp")
      table.bigint("issued_at")
      table.bigint("sent_at")
      table.bigint("expires_at")
      table.smallint("tries_left")
    })

    .createTable("email_confirm_email", (table) => {
      table.bigIncrements("id").primary()
      table.bigint("user_id")
      table.string("email", 320)
      table.binary("selector", 16).unique()
      table.binary("validator", 32).unique()
      table.bigint("issued_at")
      table.bigint("sent_at")
      table.bigint("expires_at")
    })

    .createTable("email_revert_email", (table) => {
      table.bigIncrements("id").primary()
      table.bigint("user_id")
      table.string("email", 320)
      table.binary("selector", 16).unique()
      table.binary("validator", 32).unique()
      table.bigint("issued_at")
      table.bigint("sent_at")
      table.bigint("expires_at")
    })

    .createTable("email_change_password", (table) => {
      table.bigIncrements("id").primary()
      table.bigint("user_id")
      table.string("email", 320)
      table.binary("selector", 16).unique()
      table.binary("validator", 32).unique()
      table.bigint("issued_at")
      table.bigint("sent_at")
      table.bigint("expires_at")
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable("email_verify_email")

    .dropTable("email_confirm_email")
    .dropTable("email_revert_email")

    .dropTable("email_change_password")
}
