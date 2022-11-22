import create from "zustand"
import { immer } from 'zustand/middleware/immer'
import { ISession } from "@shared/session";
import { IUser } from "@shared/user";
import { array } from "../lib/array";
import api from "./api";
import { useAppStore } from "./appStore";
import { IAccess } from "@shared/access";

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

  queryAuth: () => Promise<boolean>;
  queryInitiateSignup: (username: string, email: string) => Promise<boolean>;
  queryConfirmSignup: (username: string, email: string, password: string, otp: string) => Promise<boolean>;
  queryLogin: (info: string, password: string) => Promise<boolean>;
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
  queryGrantAccess: () => Promise<boolean>;
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

  queryAuth: async () => {
    const { data, err } = await api.auth();
    const authorized = !(err || !data);

    set(state => { state.authorized = authorized })
    useAppStore.getState().setAuthLoading(false);
    return authorized;
  },

  queryInitiateSignup: async (username: string, email: string) => {
    const { data, err } = await api.initiateSignup(username, email);
    if (err || !data) return false;
    return true;
  },

  queryConfirmSignup: async (username: string, email: string, password: string, otp: string) => {
    const { data, err } = await api.confirmSignup(username, email, password, otp);
    if (err || !data) return false;

    set(state => { state.authorized = true })
    return true;
  },

  queryLogin: async (info: string, password: string) => {
    const { data, err } = await api.login(info, password);
    if (err || !data) return false;

    set(state => { state.authorized = true })
    return true;
  },

  queryLogout: async () => {
    const { data, err } = await api.logout();
    if (err || !data) return false;

    set(initialState);
    return true;
  },

  queryGetUser: async () => {
    const { data, err } = await api.getUser();
    if (err || !data) return false;

    set(state => { state.user = data; })
    return true;
  },

  queryChangeUsername: async (newUsername: string) => {
    const { data, err } = await api.changeUsername(newUsername);
    if (err || !data) return false;
    if (!await get().queryGetUser()) return false;
    return true;
  },

  queryInitiateEmailChange: async (newEmail: string) => {
    const { data, err } = await api.initiateEmailChange(newEmail);
    if (err || !data) return false;
    return true;
  },

  queryConfirmEmailChange: async (token: string) => {
    const { data, err } = await api.confirmEmailChange(token);
    if (err || !data) return false;
    if (!await get().queryGetUser()) return false;
    return true;
  },

  queryRevertEmailChange: async (token: string) => {
    const { data, err } = await api.revertEmailChange(token);
    if (err || !data) return false;
    if (!await get().queryGetUser()) return false;
    return true;
  },

  queryInitiatePasswordChange: async (username: string, email: string) => {
    const { data, err } = await api.initiatePasswordChange(username, email);
    if (err || !data) return false;
    return true;
  },

  queryConfirmPasswordChange: async (newPassword: string, token: string) => {
    const { data, err } = await api.confirmPasswordChange(newPassword, token);
    if (err || !data) return false;
    return true;
  },

  queryGetCurrentSession: async () => {
    const { data, err } = await api.getCurrentSession();
    if (err || !data) return;

    set(state => { state.currentSession = data; })
  },

  queryGetSessions: async (type: "newer" | "older", refresh?: boolean) => {
    const anchor = array.getAnchor(get().session.ids, type, refresh);
    const { data, err } = await api.getSessions(anchor, type);
    if (err || !data) return;

    set(state => {
      if (refresh) state.session = { ids: [], entities: {} };
      state.session.ids = array.sort([...data.map(session => session.id)]);
      data.forEach(session => void (state.session.entities[session.id] = session))
    })
  },

  queryTerminateSession: async (sessionId: number) => {
    const { data, err } = await api.terminateSession(sessionId);
    if (err || !data) return;

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
    const { data, err } = await api.getAccesses(anchor, type);
    if (err || !data) return;

    set(state => {
      if (refresh) state.access = { ids: [], entities: {} };
      state.access.ids = array.sort([...data.map(access => access.id)]);
      data.forEach(access => void (state.access.entities[access.id] = access))
    })
  },

  queryGrantAccess: async () => {
    const { data, err } = await api.grantAccess();
    if (err || !data) return false;
    return true;
  },

  queryRevokeAccess: async (accessId) => {
    const { data, err } = await api.revokeAccess(accessId);
    if (err || !data) return;

    set(state => {
      let ids = state.access.ids;
      let entities = state.access.entities;

      ids = ids.filter(id => id !== accessId);
      delete entities[accessId];
    })
  },
})))