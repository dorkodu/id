import * as mysql from "mysql";

export class DB {
  public pool!: mysql.Pool;

  public init() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT as string),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,

      multipleStatements: true,

      connectionLimit: 1
    });
  }

  public async query(sql: string, values: any[]) {
    return new Promise<{ err: mysql.MysqlError | null, result: any }>((resolve, reject) => {
      this.pool.query(sql, values, (err, result) => {
        resolve({ err, result });
      });
    })
  }
}

export const db = new DB();