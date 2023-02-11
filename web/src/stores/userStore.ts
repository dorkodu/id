import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { array } from "../lib/array";
import { useAppStore } from "./appStore";
import { request, sage } from "./api";
import type { IUser } from "@api/types/user";
import type { ISession } from "@api/types/session";
import type { IAccess } from "@api/types/access";
import { ErrorCode } from "@api/types/error_codes";

interface State {
  authorized: boolean;
  user: IUser | undefined;

  currentSession: ISession | undefined;
  session: {
    // TODO: Add more sorting options
    sorted: ISession[];
    entities: { [key: string]: ISession };
  };

  access: {
    // TODO: Add more sorting options
    sorted: IAccess[];
    entities: { [key: string]: IAccess };
  };
}

interface Action {
  setUser: (data: IUser | undefined) => void;
  setCurrentSession: (data: ISession | undefined) => void;
  setSessions: (data: ISession[] | undefined, refresh?: boolean) => void;
  setAccesses: (data: IAccess[] | undefined, refresh?: boolean) => void;

  queryAuth: () => Promise<boolean>;

  querySignup: (username: string, email: string) => Promise<"ok" | "error" | "username" | "email" | "both">;
  queryConfirmSignup: (password: string, token: string | null) => Promise<boolean>;

  queryLogin: (info: string, password: string) => Promise<"ok" | "error" | "verify">;
  queryVerifyLogin: (token: string | null) => Promise<boolean>;

  queryLogout: () => Promise<boolean>;

  queryGetUser: () => Promise<boolean>;
  queryEditProfile: (name: string, username: string, bio: string) => Promise<boolean>;
  queryInitiateEmailChange: (newEmail: string) => Promise<boolean>;
  queryConfirmEmailChange: (token: string) => Promise<boolean>;
  queryRevertEmailChange: (token: string) => Promise<boolean>;
  queryInitiatePasswordChange: (username: string, email: string) => Promise<boolean>;
  queryConfirmPasswordChange: (newPassword: string, token: string) => Promise<boolean>;

  queryGetCurrentSession: () => Promise<void>;
  queryGetSessions: (type: "newer" | "older", refresh?: boolean) => Promise<boolean>;
  queryTerminateSession: (sessionId: string) => Promise<void>;

  queryGetAccesses: (type: "newer" | "older", refresh?: boolean) => Promise<boolean>;
  queryGrantAccess: (service: string) => Promise<string | undefined>;
  queryRevokeAccess: (accessId: string) => Promise<void>;
}

const initialState: State = {
  authorized: false,
  user: undefined,
  currentSession: undefined,
  session: { sorted: [], entities: {} },
  access: { sorted: [], entities: {} },
};

export const useUserStore = create(
  immer<State & Action>((set, get) => ({
    ...initialState,

    setUser: (data) => {
      set((state) => {
        state.user = data;
      });
    },

    setCurrentSession: (data) => {
      set((state) => {
        state.currentSession = data;
      });
    },

    setSessions: (data, refresh) => {
      if (!data) return;
      set((state) => {
        if (refresh) state.session = { sorted: [], entities: {} };
        data.forEach(
          (session) => void (state.session.entities[session.id] = session)
        );

        state.session.sorted = array.sort(
          Object.keys(state.session.entities).map(
            (id) => state.session.entities[id]
          ) as ISession[],
          "createdAt",
          (a, b) => b - a
        );
      });
    },

    setAccesses: (data, refresh) => {
      if (!data) return;
      set((state) => {
        if (refresh) state.access = { sorted: [], entities: {} };
        data.forEach(
          (access) => void (state.access.entities[access.id] = access)
        );

        state.access.sorted = array.sort(
          Object.keys(state.access.entities).map(
            (id) => state.access.entities[id]
          ) as IAccess[],
          "createdAt",
          (a, b) => b - a
        );
      });
    },

    queryAuth: async () => {
      const res = await sage.get(
        { a: sage.query("auth", undefined) },
        (query) => request(query)
      );

      const authorized = !(!res?.a.data || res.a.error);
      set((state) => {
        state.authorized = authorized;
      });
      useAppStore.getState().setAuthLoading(false);
      return authorized;
    },

    querySignup: async (username, email) => {
      const res = await sage.get(
        { a: sage.query("signup", { username, email }) },
        (query) => request(query)
      );

      if (res?.a.error) {
        switch (res.a.error) {
          case ErrorCode.UsernameUsed: return "username";
          case ErrorCode.EmailUsed: return "email";
          case ErrorCode.UsernameAndEmailUsed: return "both";
          default: return "error";
        }
      }

      return "ok";
    },

    queryConfirmSignup: async (password, token) => {
      if (token === null) return false;

      const res = await sage.get(
        { a: sage.query("confirmSignup", { password, token }) },
        (query) => request(query)
      );

      const status = !(!res?.a.data || res.a.error);
      if (status) set((state) => { state.authorized = true });

      return status;
    },

    queryLogin: async (info, password) => {
      const res = await sage.get(
        { a: sage.query("login", { info, password }) },
        (query) => request(query)
      );

      const status = !(!res?.a.data || res.a.error);

      if (status) {
        set(state => { state.authorized = true });
        return "ok";
      }

      if (res?.a.error) {
        switch (res.a.error) {
          case ErrorCode.LoginNewLocation: return "verify";
          case ErrorCode.Default:
          default:
            return "error";
        }
      }

      return "error";
    },

    queryVerifyLogin: async (token) => {
      if (token === null) return false;

      const res = await sage.get(
        { a: sage.query("verifyLogin", { token }) },
        (query) => request(query)
      );

      if (!res?.a.data || res.a.error) return false;
      return true;
    },

    queryLogout: async () => {
      const res = await sage.get(
        { a: sage.query("logout", undefined) },
        (query) => request(query)
      );

      if (!res?.a.data || res.a.error) return false;
      set(initialState);
      return true;
    },

    queryGetUser: async () => {
      const res = await sage.get(
        { a: sage.query("getUser", undefined) },
        (query) => request(query)
      );

      if (!res?.a.data || res.a.error) return false;
      set((state) => {
        state.user = res.a.data;
      });
      return true;
    },

    queryEditProfile: async (name, username, bio) => {
      const res = await sage.get(
        { a: sage.query("editProfile", { name, username, bio }) },
        (query) => request(query)
      );

      const status = !(!res?.a.data || res.a.error);
      set(state => {
        if (!status || !state.user) return;
        state.user.name = name;
        state.user.username = username;
        state.user.bio = bio;
      });

      return status;
    },

    queryInitiateEmailChange: async (newEmail) => {
      const res = await sage.get(
        { a: sage.query("initiateEmailChange", { newEmail }) },
        (query) => request(query)
      );

      if (!res?.a.data || res.a.error) return false;
      return true;
    },

    queryConfirmEmailChange: async (token) => {
      const res = await sage.get(
        { a: sage.query("confirmEmailChange", { token }) },
        (query) => request(query)
      );

      if (!res?.a.data || res.a.error) return false;
      return true;
    },

    queryRevertEmailChange: async (token) => {
      const res = await sage.get(
        { a: sage.query("revertEmailChange", { token }) },
        (query) => request(query)
      );

      if (!res?.a.data || res.a.error) return false;
      return true;
    },

    queryInitiatePasswordChange: async (username, email) => {
      const res = await sage.get(
        { a: sage.query("initiatePasswordChange", { username, email }) },
        (query) => request(query)
      );

      if (!res?.a.data || res.a.error) return false;
      return true;
    },

    queryConfirmPasswordChange: async (newPassword, token) => {
      const res = await sage.get(
        { a: sage.query("confirmPasswordChange", { newPassword, token }) },
        (query) => request(query)
      );

      if (!res?.a.data || res.a.error) return false;
      return true;
    },

    queryGetCurrentSession: async () => {
      const res = await sage.get(
        { a: sage.query("getCurrentSession", undefined) },
        (query) => request(query)
      );

      if (!res?.a.data || res.a.error) return;
      set((state) => {
        state.currentSession = res.a.data;
      });
    },

    queryGetSessions: async (type, refresh) => {
      const anchor = array.getAnchor(
        get().session.sorted,
        "id",
        "-1",
        type,
        refresh
      );

      const res = await sage.get(
        { a: sage.query("getSessions", { anchor, type }) },
        (query) => request(query)
      );

      const status = !(!res?.a.data || res.a.error);
      if (res?.a.data) get().setSessions(res.a.data, refresh);
      return status;
    },

    queryTerminateSession: async (sessionId) => {
      const res = await sage.get(
        { a: sage.query("terminateSession", { sessionId }) },
        (query) => request(query)
      );

      if (!res?.a.data || res.a.error) return;
      set((state) => {
        state.session.sorted = state.session.sorted.filter(
          (session) => session.id !== sessionId
        );
        delete state.session.entities[sessionId];
      });

      if (get().currentSession?.id === sessionId) set(initialState);
    },

    queryGetAccesses: async (type, refresh) => {
      const anchor = array.getAnchor(
        get().access.sorted,
        "id",
        "-1",
        type,
        refresh
      );

      const res = await sage.get(
        { a: sage.query("getAccesses", { anchor, type }) },
        (query) => request(query)
      );

      const status = !(!res?.a.data || res.a.error);
      if (res?.a.data) get().setAccesses(res.a.data, refresh);
      return status;
    },

    queryGrantAccess: async (service) => {
      const res = await sage.get(
        { a: sage.query("grantAccess", { service }) },
        (query) => request(query)
      );

      if (!res?.a.data || res.a.error) return undefined;
      return res.a.data.code;
    },

    queryRevokeAccess: async (accessId) => {
      const res = await sage.get(
        { a: sage.query("revokeAccess", { accessId }) },
        (query) => request(query)
      );

      if (!res?.a.data || res.a.error) return;
      set((state) => {
        state.access.sorted = state.access.sorted.filter(
          (access) => access.id !== accessId
        );
        delete state.access.entities[accessId];
      });
    },
  }))
);
