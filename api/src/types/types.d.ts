declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PG_HOST?: string;
      PG_PORT?: string;
      PG_NAME?: string;
      PG_USER?: string;
      PG_PASSWORD?: string;

      SMTP_HOST?: string;
      SMTP_PORT?: string;
      SMTP_USER?: string;
      SMTP_PASSWORD?: string;

      BCRYPT_ROUNDS?: string;

      PORT?: string;
      NODE_ENV?: string;
    }
  }
}

import 'express';

declare module 'express' {
  export interface Response {
    locals: {
      userId?: number;
      tokenId?: number;
    }
  }
}

export { }