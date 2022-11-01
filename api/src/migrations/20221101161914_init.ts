import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("users", (table) => {
      table.bigint("id").primary()
      table.string("username", 16).unique()
      table.string("email", 320).unique()
      table.binary("password", 60)
      table.bigint("joinedAt")
    })
    .createTable("auth_token", (table) => {
      table.bigint("id").primary()
      table.bigint("userId")
      table.binary("selector", 16).unique()
      table.binary("validator", 32).unique()
      table.bigint("expires")
    })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable("users")
    .dropTable("auth_token")
}
