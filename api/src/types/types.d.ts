declare global {
  namespace NodeJS {
    interface ProcessEnv {
      POSTGRES_HOST?: string;
      PGPORT?: string;
      POSTGRES_DB?: string;
      POSTGRES_USER?: string;
      POSTGRES_PASSWORD?: string;

      SMTP_HOST?: string;
      SMTP_PORT?: string;
      SMTP_USER?: string;
      SMTP_PASSWORD?: string;

      BCRYPT_ROUNDS?: string;

      PORT?: string;
      NODE_ENV?: string;
      SERVICE_WHITELIST?: string;
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