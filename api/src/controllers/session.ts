import { getSessionsSchema, terminateSessionSchema } from "../schemas/session";
import sage from "@dorkodu/sage-server";
import { SchemaContext } from "./_schema";
import { z } from "zod";

const getCurrentSession = sage.resource(
  {} as SchemaContext,
  undefined,
  async (_arg, _ctx) => {
    return undefined;
  }
)

const getSessions = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof getSessionsSchema>,
  async (_arg, _ctx) => {
    return undefined;
  }
)

const terminateSession = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof terminateSessionSchema>,
  async (_arg, _ctx) => {
    return undefined;
  }
)

export default {
  getCurrentSession,
  getSessions,
  terminateSession,
}