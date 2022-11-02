import postgres from 'postgres'
import { config } from './config'

const pg = postgres({
  host: config.postgresHost,
  port: config.postgresPort,
  user: config.postgresUser,
  password: config.postgresPassword,
  database: config.postgresName,
  transform: postgres.toCamel,
  types: {
    bigint: {
      to: 20,
      from: [20],
      parse: raw => Number(raw),
      serialize: raw => raw.toString(),
    }
  }
})

export default pg