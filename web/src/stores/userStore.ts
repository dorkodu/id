import create from "zustand"
import { immer } from 'zustand/middleware/immer'
import { ISession } from "@shared/session";
import { IUser } from "@shared/user";
import { array } from "../lib/array";
import { useAppStore } from "./appStore";
import { IAccess } from "@shared/access";
import { request, sage } from "./api";

interface State {
  authorized: boolean;
  user: IUser | undefined;

  currentSession: ISession | undefined;
  session: {
    ids: number[],
    entities: { [key: number | string]: ISession }
  };

  access: {
    ids: number[],
    entities: { [key: number | string]: IAccess }
  }
}

interface Action {
  getSessions: () => ISession[];
  getAccesses: () => IAccess[];

  setUser: (data: IUser | undefined) => void;
  setCurrentSession: (data: ISession | undefined) => void;
  setSessions: (data: ISession[] | undefined, refresh?: boolean) => void;
  setAccesses: (data: IAccess[] | undefined, refresh?: boolean) => void;

  queryAuth: () => Promise<boolean>;

  querySignup: (username: string, email: string) => Promise<boolean>;
  queryVerifySignup: (token: string) => Promise<boolean>;
  queryConfirmSignup: (username: string, email: string, password: string) => Promise<boolean>;

  queryLogin: (info: string, password: string) => Promise<"ok" | "err" | "verify">;
  queryVerifyLogin: (token: string) => Promise<boolean>;

  queryLogout: () => Promise<boolean>;

  queryGetUser: () => Promise<boolean>;
  queryChangeUsername: (newUsername: string) => Promise<boolean>;
  queryInitiateEmailChange: (newEmail: string) => Promise<boolean>;
  queryConfirmEmailChange: (token: string) => Promise<boolean>;
  queryRevertEmailChange: (token: string) => Promise<boolean>;
  queryInitiatePasswordChange: (username: string, email: string) => Promise<boolean>;
  queryConfirmPasswordChange: (newPassword: string, token: string) => Promise<boolean>;

  queryGetCurrentSession: () => Promise<void>;
  queryGetSessions: (type: "newer" | "older", refresh?: boolean) => Promise<void>;
  queryTerminateSession: (sessionId: number) => Promise<void>;

  queryGetAccesses: (type: "newer" | "older", refresh?: boolean) => Promise<void>;
  queryGrantAccess: (service: string) => Promise<string | undefined>;
  queryRevokeAccess: (accessId: number) => Promise<void>;
}

const initialState: State = {
  authorized: false,
  user: undefined,
  currentSession: undefined,
  session: { ids: [], entities: {} },
  access: { ids: [], entities: {} },
}

export const useUserStore = create(immer<State & Action>((set, get) => ({
  ...initialState,

  getSessions: () => {
    const ids = get().session.ids;
    const entities = get().session.entities;
    const sessions: ISession[] = [];

    ids.forEach(id => {
      if (get().currentSession?.id == id) return;
      const session = entities[id];
      if (session) sessions.push(session);
    })

    return sessions;
  },

  getAccesses: () => {
    const ids = get().access.ids;
    const entities = get().access.entities;
    const accesss: IAccess[] = [];

    ids.forEach(id => {
      const access = entities[id];
      if (access) accesss.push(access);
    })

    return accesss;
  },

  setUser: (data) => {
    set(state => { state.user = data })
  },

  setCurrentSession: (data) => {
    set(state => { state.currentSession = data })
  },

  setSessions: (data: ISession[] | undefined, refresh?: boolean) => {
    if (!data) return;
    set(state => {
      if (refresh) state.session = { ids: [], entities: {} };
      state.session.ids = array.sort([...data.map(session => session.id), ...state.session.ids]);
      data.forEach(session => void (state.session.entities[session.id] = session))
    })
  },

  setAccesses: (data: IAccess[] | undefined, refresh?: boolean) => {
    if (!data) return;
    set(state => {
      if (refresh) state.access = { ids: [], entities: {} };
      state.access.ids = array.sort([...data.map(access => access.id), ...state.access.ids]);
      data.forEach(access => void (state.access.entities[access.id] = access))
    })
  },

  queryAuth: async () => {
    const res = await sage.get(
      { a: sage.query("auth", undefined) },
      (query) => request(query)
    )

    const authorized = !(!res || !res.a);
    set(state => { state.authorized = authorized })
    useAppStore.getState().setAuthLoading(false);
    return authorized;
  },

  querySignup: async (username, email) => {
    const res = await sage.get(
      { a: sage.query("signup", { username, email }) },
      (query) => request(query)
    )

    if (!res || !res.a) return false;
    return true;
  },

  queryVerifySignup: async (token) => {
    const res = await sage.get(
      { a: sage.query("verifySignup", { token }) },
      (query) => request(query)
    )

    if (!res || !res.a) return false;
    return true;
  },

  queryConfirmSignup: async (username, email, password) => {
    const res = await sage.get(
      { a: sage.query("confirmSignup", { username, email, password }) },
      (query) => request(query)
    )

    if (!res || !res.a) return false;
    set(state => { state.authorized = true })
    return true;
  },

  queryLogin: async (info: string, password: string) => {
    const res = await sage.get(
      { a: sage.query("login", { info, password }) },
      (query) => request(query)
    )

    if (!res || !res.a) return false;
    set(state => { state.authorized = true })
    return true;
  },

  queryVerifyLogin: async (token) => {
    const res = await sage.get(
      { a: sage.query("verifyLogin", { token }) },
      (query) => request(query)
    )

    if (!res || !res.a) return false;
    return true;
  },

  queryLogout: async () => {
    const res = await sage.get(
      { a: sage.query("logout", undefined) },
      (query) => request(query)
    )

    if (!res || !res.a) return false;
    set(initialState);
    return true;
  },

  queryGetUser: async () => {
    const res = await sage.get(
      { a: sage.query("getUser", undefined) },
      (query) => request(query)
    )

    if (!res || !res.a) return false;
    set(state => { state.user = res.a; })
    return true;
  },

  queryChangeUsername: async (newUsername: string) => {
    const res = await sage.get(
      { a: sage.query("changeUsername", { newUsername }) },
      (query) => request(query)
    )

    if (!res || !res.a) return false;
    return true;
  },

  queryInitiateEmailChange: async (newEmail: string) => {
    const res = await sage.get(
      { a: sage.query("initiateEmailChange", { newEmail }) },
      (query) => request(query)
    )

    if (!res || !res.a) return false;
    return true;
  },

  queryConfirmEmailChange: async (token: string) => {
    const res = await sage.get(
      { a: sage.query("confirmEmailChange", { token }) },
      (query) => request(query)
    )

    if (!res || !res.a) return false;
    return true;
  },

  queryRevertEmailChange: async (token: string) => {
    const res = await sage.get(
      { a: sage.query("revertEmailChange", { token }) },
      (query) => request(query)
    )

    if (!res || !res.a) return false;
    return true;
  },

  queryInitiatePasswordChange: async (username: string, email: string) => {
    const res = await sage.get(
      { a: sage.query("initiatePasswordChange", { username, email }) },
      (query) => request(query)
    )

    if (!res || !res.a) return false;
    return true;
  },

  queryConfirmPasswordChange: async (newPassword: string, token: string) => {
    const res = await sage.get(
      { a: sage.query("confirmPasswordChange", { newPassword, token }) },
      (query) => request(query)
    )

    if (!res || !res.a) return false;
    return true;
  },

  queryGetCurrentSession: async () => {
    const res = await sage.get(
      { a: sage.query("getCurrentSession", undefined) },
      (query) => request(query)
    )

    if (!res || !res.a) return;
    const data = res.a;

    set(state => {
      state.currentSession = data;
    })
  },

  queryGetSessions: async (type: "newer" | "older", refresh?: boolean) => {
    const anchor = array.getAnchor(get().session.ids, type, refresh);

    const res = await sage.get(
      { a: sage.query("getSessions", { anchor, type }) },
      (query) => request(query)
    )

    if (!res || !res.a) return;
    const data = res.a;

    get().setSessions(data, refresh);
  },

  queryTerminateSession: async (sessionId: number) => {
    const res = await sage.get(
      { a: sage.query("terminateSession", { sessionId }) },
      (query) => request(query)
    )

    if (!res || !res.a) return;
    set(state => {
      let ids = state.session.ids;
      let entities = state.session.entities;

      ids = ids.filter(id => id !== sessionId);
      delete entities[sessionId];
    })

    if (get().currentSession?.id === sessionId)
      set(initialState);
  },

  queryGetAccesses: async (type, refresh) => {
    const anchor = array.getAnchor(get().access.ids, type, refresh);

    const res = await sage.get(
      { a: sage.query("getAccesses", { anchor, type }) },
      (query) => request(query)
    )

    if (!res || !res.a) return;
    const data = res.a;

    get().setAccesses(data, refresh);
  },

  queryGrantAccess: async (service: string) => {
    const res = await sage.get(
      { a: sage.query("grantAccess", { service }) },
      (query) => request(query)
    )

    if (!res || !res.a) return undefined;
    return res.a.code;
  },

  queryRevokeAccess: async (accessId) => {
    const res = await sage.get(
      { a: sage.query("revokeAccess", { accessId }) },
      (query) => request(query)
    )

    if (!res || !res.a) return;
    set(state => {
      let ids = state.access.ids;
      let entities = state.access.entities;

      ids = ids.filter(id => id !== accessId);
      delete entities[accessId];
    })
  },
})))