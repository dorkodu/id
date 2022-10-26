import postgres from 'postgres'
import { config } from './config'

const pg = postgres({
  host: config.databaseHost,
  port: config.databasePort,
  database: config.databaseName,
  username: config.databaseUser,
  password: config.databasePassword,
})

export default pg
