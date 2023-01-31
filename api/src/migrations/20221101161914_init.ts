import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("users", (table) => {
      table.bigint("id").primary()
      table.specificType("name", "varchar(64) COLLATE \"C\"").notNullable()
      table.specificType("bio", "varchar(500) COLLATE \"C\"").notNullable()
      table.specificType("username", "varchar(16) COLLATE \"C\"").notNullable()
      table.specificType("username_ci", "varchar(16) COLLATE \"C\"").notNullable()
      table.specificType("email", "varchar(320) COLLATE \"C\"").notNullable()
      table.specificType("email_ci", "varchar(320) COLLATE \"C\"").notNullable()
      table.bigint("joined_at").notNullable()
      table.binary("password", 60).notNullable()

      table.unique(["username_ci"], undefined)
      table.unique(["email_ci"], undefined)
    })

    .createTable("sessions", (table) => {
      table.bigint("id").primary()
      table.bigint("user_id").notNullable()
      table.binary("selector", 32).notNullable()
      table.binary("validator", 32).notNullable()
      table.bigint("created_at").notNullable()
      table.bigint("expires_at").notNullable()
      table.specificType("user_agent", "varchar(256) COLLATE \"C\"").notNullable()
      table.specificType("ip", "inet").notNullable()

      table.index("ip", undefined, "btree")
      table.index("user_id", undefined, "hash")
      table.index("expires_at", undefined, "btree")

      table.unique(["selector"], undefined)
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable("users")
    .dropTable("sessions")
}
