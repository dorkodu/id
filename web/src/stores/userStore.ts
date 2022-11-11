import create from "zustand"
import { immer } from 'zustand/middleware/immer'
import { ISession } from "../../../api/src/types/session";
import { IUser } from "../../../api/src/types/user";

interface State {
  user: IUser | undefined;
  currentSession: ISession | undefined;
  sessions: ISession[];

  queryAuth: () => Promise<void>;
  queryInitiateSignup: () => Promise<void>;
  queryCompleteSignup: () => Promise<void>;
  queryLogin: () => Promise<void>;
  queryLogout: () => Promise<void>;

  queryUser: () => Promise<void>;
  queryChangeUsername: () => Promise<void>;
  queryInitiateEmailChange: () => Promise<void>;
  queryConfirmEmailChange: () => Promise<void>;
  queryRevertEmailChange: () => Promise<void>;
  queryInitiatePasswordChange: () => Promise<void>;
  queryConfirmPasswordChange: () => Promise<void>;

  queryCurrentSession: () => Promise<void>;
  querySessions: () => Promise<void>;
  queryTerminateSession: () => Promise<void>;
}

export const useUserStore = create(immer<State>((set, get) => ({
  user: undefined,
  currentSession: undefined,
  sessions: [],

  queryAuth: async () => {

  },

  queryInitiateSignup: async () => {

  },

  queryCompleteSignup: async () => {

  },

  queryLogin: async () => {

  },

  queryLogout: async () => {

  },

  queryUser: async () => {

  },

  queryChangeUsername: async () => {

  },

  queryInitiateEmailChange: async () => {

  },

  queryConfirmEmailChange: async () => {

  },

  queryRevertEmailChange: async () => {

  },

  queryInitiatePasswordChange: async () => {

  },

  queryConfirmPasswordChange: async () => {

  },

  queryCurrentSession: async () => {

  },

  querySessions: async () => {

  },

  queryTerminateSession: async () => {

  },
})))