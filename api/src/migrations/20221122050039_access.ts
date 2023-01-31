import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("access_tokens", (table) => {
      table.bigint("id").primary()
      table.bigint("user_id")
      table.binary("selector", 32)
      table.binary("validator", 32)
      table.bigint("created_at")
      table.bigint("expires_at")
      table.string("user_agent", 256)
      table.specificType("ip", "inet")
      table.string("service", 128)

      table.index("user_id", undefined, "hash")
      table.index("expires_at", undefined, "btree")

      table.unique(["selector"], undefined)
    })

    .createTable("access_codes", (table) => {
      table.bigint("id").primary()
      table.bigint("user_id")
      table.binary("selector", 32)
      table.binary("validator", 32)
      table.bigint("created_at")
      table.bigint("expires_at")
      table.string("user_agent", 256)
      table.specificType("ip", "inet")
      table.string("service", 128)

      table.index("user_id", undefined, "hash")
      table.index("expires_at", undefined, "btree")

      table.unique(["selector"], undefined)
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable("access_tokens")
    .dropTable("access_codes")
}
