import { FastifyLoggerInstance, FastifyReply, FastifyRequest } from "fastify"
import { RouteGenericInterface } from "fastify/types/route"
import { IncomingMessage, Server, ServerResponse } from "http"

export type ReqType = FastifyRequest<RouteGenericInterface, Server, IncomingMessage, unknown, FastifyLoggerInstance>
export type ResType = FastifyReply<Server, IncomingMessage, ServerResponse, RouteGenericInterface, unknown>

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string;
      DB_PORT: string;
      DB_NAME: string;
      DB_USER: string;
      DB_PASSWORD: string;

      PORT?: string;
    }
  }
}