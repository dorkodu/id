import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "postgresql",
    connection: {
      host: "oath_postgres",
      port: 5432,
      database: "oath",
      user: "postgres",
      password: "postgres",
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  //staging: {
  //  client: "postgresql",
  //  connection: {
  //    database: "my_db",
  //    user: "username",
  //    password: "password"
  //  },
  //  pool: {
  //    min: 2,
  //    max: 10
  //  },
  //  migrations: {
  //    tableName: "knex_migrations"
  //  }
  //},

  //production: {
  //  client: "postgresql",
  //  connection: {
  //    database: "my_db",
  //    user: "username",
  //    password: "password"
  //  },
  //  pool: {
  //    min: 2,
  //    max: 10
  //  },
  //  migrations: {
  //    tableName: "knex_migrations"
  //  }
  //}

};

module.exports = config;
