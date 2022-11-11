import create from "zustand"
import { immer } from 'zustand/middleware/immer'
import { ISession } from "../../../api/src/types/session";
import { IUser } from "../../../api/src/types/user";
import { array } from "../lib/array";
import api from "./api";

interface State {
  user: IUser | undefined;
  currentSession: ISession | undefined;
  session: {
    ids: number[],
    entities: { [key: number | string]: ISession }
  };
}

interface Action {
  queryAuth: () => Promise<boolean>;
  queryInitiateSignup: (username: string, email: string) => Promise<boolean>;
  queryConfirmSignup: (username: string, email: string, password: string, otp: string) => Promise<boolean>;
  queryLogin: (username: string, password: string) => Promise<boolean>;
  queryLogout: () => Promise<boolean>;

  queryGetUser: () => Promise<void>;
  queryChangeUsername: (newUsername: string) => Promise<boolean>;
  queryInitiateEmailChange: (newEmail: string) => Promise<boolean>;
  queryConfirmEmailChange: (token: string) => Promise<boolean>;
  queryRevertEmailChange: (token: string) => Promise<boolean>;
  queryInitiatePasswordChange: (username: string, email: string) => Promise<boolean>;
  queryConfirmPasswordChange: (newPassword: string, token: string) => Promise<boolean>;

  queryGetCurrentSession: () => Promise<void>;
  queryGetSessions: (type: "newer" | "older", refresh?: boolean) => Promise<void>;
  queryTerminateSession: (sessionId: number) => Promise<void>;
}

const initialState: State = {
  user: undefined,
  currentSession: undefined,
  session: { ids: [], entities: {} },
}

export const useUserStore = create(immer<State & Action>((set, get) => ({
  ...initialState,

  queryAuth: async () => {
    const { data, err } = await api.auth();
    if (err || !data) return false;

    await get().queryGetUser();
    return true;
  },

  queryInitiateSignup: async (username: string, email: string) => {
    const { data, err } = await api.initiateSignup(username, email);
    if (err || !data) return false;
    return true;
  },

  queryConfirmSignup: async (username: string, email: string, password: string, otp: string) => {
    const { data, err } = await api.confirmSignup(username, email, password, otp);
    if (err || !data) return false;
    return true;
  },

  queryLogin: async (username: string, password: string) => {
    const { data, err } = await api.login(username, password);
    if (err || !data) return false;
    return true;
  },

  queryLogout: async () => {
    const { data, err } = await api.logout();
    if (err || !data) return false;
    return true;
  },

  queryGetUser: async () => {
    const { data, err } = await api.getUser();
    if (err || !data) return;

    set(state => { state.user = data; })
  },

  queryChangeUsername: async (newUsername: string) => {
    const { data, err } = await api.changeUsername(newUsername);
    if (err || !data) return false;

    set(state => { state.user && (state.user.username = newUsername) })
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
    return true;
  },

  queryRevertEmailChange: async (token: string) => {
    const { data, err } = await api.revertEmailChange(token);
    if (err || !data) return false;
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
  },
})))