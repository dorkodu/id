import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable("email_verify_login", (table) => {
      table.dropColumn("verified")
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable("email_verify_login", (table) => {
      table.boolean("verified").defaultTo(false).notNullable()
    })
}