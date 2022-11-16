import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("email_token", (table) => {
      table.bigIncrements("id").primary()
      table.bigint("user_id")
      table.string("email", 320)
      table.binary("selector", 16).unique()
      table.binary("validator", 32).unique()
      table.bigint("issued_at")
      table.bigint("sent_at")
      table.bigint("expires_at")
      table.string("type", 32)
      table.unique(["user_id", "issued_at", "type"])
    })
    .createTable("email_otp", (table) => {
      table.bigIncrements("id").primary()
      table.string("username", 16)
      table.string("email", 320)
      table.integer("otp")
      table.bigint("sent_at")
      table.bigint("expires_at")
      table.smallint("tries_left")
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable("email_token")
    .dropTable("email_otp")
}
