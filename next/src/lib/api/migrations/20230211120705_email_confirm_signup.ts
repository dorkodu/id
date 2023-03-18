import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable("email_verify_signup", (table) => {
      table.dropColumn("verified")
    })
    .renameTable("email_verify_signup", "email_confirm_signup")
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.renameTable("email_confirm_signup", "email_verify_signup");

  return knex.schema
    .alterTable("email_verify_signup", (table) => {
      table.boolean("verified")
    })
}