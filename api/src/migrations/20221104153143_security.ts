import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("security_notification", (table) => {
      table.bigIncrements("id").primary()
      table.bigint("user_id")
      table.bigint("issued_at")
      table.bigint("sent_at")
      table.bigint("expires_at")
      table.string("user_agent", 256)
      table.specificType("ip", "inet")
      table.string("type", 32)
    })
    .createTable("security_verification", (table) => {
      table.bigIncrements("id").primary()
      table.bigint("user_id")
      table.string("email", 320)
      table.binary("selector", 16).unique()
      table.binary("validator", 32).unique()
      table.bigint("issued_at")
      table.bigint("sent_at")
      table.bigint("expires_at")
      table.string("type", 32)
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable("security_notification")
    .dropTable("security_verification")
}
