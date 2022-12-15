import create from "zustand"
import { immer } from 'zustand/middleware/immer'
import { ISession } from "@shared/session";
import { IUser } from "@shared/user";
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
}

const initialState: State = {
  authorized: false,
  user: undefined,
  currentSession: undefined,
  session: { ids: [], entities: {} },
  access: { ids: [], entities: {} },
}

export const useUserStore = create(immer<State & Action>((_set, get) => ({
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
})))