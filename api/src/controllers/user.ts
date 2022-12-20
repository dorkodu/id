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
import auth from "./auth";
import pg from "../pg";
import { IUserRaw, iUserSchema } from "../types/user";

const getUser = sage.resource(
  {} as SchemaContext,
  undefined,
  async (_arg, ctx) => {
    const info = await auth.getAuthInfo(ctx);
    if (!info) return undefined;

    const [result]: [IUserRaw?] = await pg`
      SELECT id, username, email, joined_at FROM users WHERE id=${info.userId}
    `;
    const parsed = iUserSchema.safeParse(result);
    if (!parsed.success) return undefined;

    return parsed.data;
  }
)

const changeUsername = sage.resource(
  {} as SchemaContext,
  {} as z.infer<typeof changeUsernameSchema>,
  async (arg, ctx) => {
    const parsed = changeUsernameSchema.safeParse(arg);
    if (!parsed.success) return undefined;

    const info = await auth.getAuthInfo(ctx);
    if (!info) return undefined;

    const { newUsername } = parsed.data;
    const result = await pg`UPDATE users SET username=${newUsername} WHERE id=${info.userId}`;
    if (result.count === 0) return undefined;

    return {};
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