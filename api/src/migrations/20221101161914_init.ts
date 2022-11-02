import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("users", (table) => {
      table.bigIncrements("id").primary()
      table.string("username", 16).unique()
      table.string("email", 320).unique()
      table.binary("password", 60)
      table.bigint("joined_at")
    })
    .createTable("auth_tokens", (table) => {
      table.bigIncrements("id").primary()
      table.bigint("user_id")
      table.binary("selector", 16).unique()
      table.binary("validator", 32).unique()
      table.bigint("created_at")
      table.bigint("expires_at")
      table.string("user_agent", 256)
      table.specificType("ip", "inet")
    })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable("users")
    .dropTable("auth_tokens")
}
