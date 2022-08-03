import * as mysql from "mysql";

export class DB {
  public static instance: mysql.Connection;

  public static async init() {
    DB.instance = mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    return new Promise<void>((resolve, reject) => {
      DB.instance.connect((err) => {
        if (err) {
          console.log(err);
          process.exit(1);
        }

        console.log("Connected to mysql database...");
        resolve();
      })
    })
  }

  public static async query(sql: string, values: any[]) {
    return new Promise<{ err: mysql.MysqlError | null, result: any }>((resolve, reject) => {
      DB.instance.query(sql, values, (err, result) => {
        resolve({ err, result });
      });
    })
  }
}