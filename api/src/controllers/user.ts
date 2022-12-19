import {
  changeUsernameSchema,
  confirmEmailChangeSchema,
  confirmPasswordChangeSchema,
  initiateEmailChangeSchema,
  initiatePasswordChangeSchema,
  revertEmailChangeSchema
} from "../schemas/user";
import sage from "@dorkodu/sage-server";
import { SchemaContext } from "./_schema";
import { z } from "zod";

const getUser = sage.resource(
  {} as SchemaContext,
  undefined,
  async (_arg, _ctx) => {
    return undefined;
  }
)

const changeUsername = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof changeUsernameSchema>,
  async (_arg, _ctx) => {
    return undefined;
  }
)

const initiateEmailChange = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof initiateEmailChangeSchema>,
  async (_arg, _ctx) => {
    return undefined;
  }
)

const confirmEmailChange = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof confirmEmailChangeSchema>,
  async (_arg, _ctx) => {
    return undefined;
  }
)

const revertEmailChange = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof revertEmailChangeSchema>,
  async (_arg, _ctx) => {
    return undefined;
  }
)

const initiatePasswordChange = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof initiatePasswordChangeSchema>,
  async (_arg, _ctx) => {
    return undefined;
  }
)

const confirmPasswordChange = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof confirmPasswordChangeSchema>,
  async (_arg, _ctx) => {
    return undefined;
  }
)

export default {
  getUser,

  changeUsername,

  initiateEmailChange,
  confirmEmailChange,
  revertEmailChange,

  initiatePasswordChange,
  confirmPasswordChange,
}