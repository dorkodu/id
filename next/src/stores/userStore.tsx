import { createStore, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { array } from "../lib/web/array";
import { request, sage } from "./api";
import { util } from "@/lib/web/util";
import { ISession } from "@/types/session";
import { IUser } from "@/types/user";
import { IAccess } from "@/types/access";
import { ErrorCode } from "@/types/error_codes";
import { createContext, useContext } from "react";

interface State {
  authorized: boolean;
  user: IUser | undefined;

  currentSession: ISession | undefined;
  session: { entities: { [key: string]: ISession } }
  access: { entities: { [key: string]: IAccess } }
}

interface Action {
  setUser: (user: IUser | undefined) => void;

  setCurrentSession: (session: ISession | undefined) => void;

  getSessions: (type: "newer" | "older") => ISession[];
  setSessions: (sessions?: ISession[], refresh?: boolean) => void;
  getSessionsAnchor: (type: "newer" | "older", refresh?: boolean) => string;

  getAccesses: (type: "newer" | "older") => IAccess[];
  setAccesses: (accesses?: IAccess[], refresh?: boolean) => void;
  getAccessesAnchor: (type: "newer" | "older", refresh?: boolean) => string;

  queryAuth: () => Promise<boolean>;

  querySignup: (username: string, email: string) => Promise<"ok" | "error" | "username" | "email" | "both">;
  queryConfirmSignup: (password: string, token: string | undefined) => Promise<boolean>;

  queryLogin: (info: string, password: string) => Promise<"ok" | "error" | "verify">;
  queryVerifyLogin: (token: string | undefined) => Promise<boolean>;

  queryLogout: () => Promise<boolean>;

  queryGetUser: () => Promise<boolean>;
  queryEditProfile: (name: string, username: string, bio: string) => Promise<"ok" | "error" | "username">;
  queryInitiateEmailChange: (newEmail: string) => Promise<boolean>;
  queryConfirmEmailChange: (token: string) => Promise<boolean>;
  queryRevertEmailChange: (token: string) => Promise<boolean>;
  queryInitiatePasswordChange: (username: string, email: string) => Promise<boolean>;
  queryConfirmPasswordChange: (newPassword: string, token: string) => Promise<boolean>;

  queryGetCurrentSession: () => Promise<void>;
  queryGetSessions: (type: "newer" | "older", refresh?: boolean) => Promise<{ status: boolean, length: number }>;
  queryTerminateSession: (sessionId: string) => Promise<void>;

  queryGetAccesses: (type: "newer" | "older", refresh?: boolean) => Promise<{ status: boolean, length: number }>;
  queryGrantAccess: (service: string) => Promise<string | undefined>;
  queryRevokeAccess: (accessId: string) => Promise<void>;
}

const initialState: State = {
  authorized: false,
  user: undefined,
  currentSession: undefined,
  session: { entities: {} },
  access: { entities: {} },
}

export const createUserStore = (props?: Partial<State>) => {
  return createStore(
    immer<State & Action>((set, get) => ({
      ...initialState,
      ...props,

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


      getSessions: (type) => {
        const object = get().session.entities;
        if (!object) return [];

        const out: ISession[] = [];
        const keys = Object.keys(object);
        keys.forEach(key => {
          const session = get().session.entities[key];
          if (session) out.push(session);
        })

        return array.sort(out, "id", ((a, b) => util.compareId(a, b, type === "newer")));
      },

      setSessions: (sessions, refresh) => {
        set(state => {
          if (refresh) state.session.entities = {};
          if (!sessions) return;

          sessions.forEach((session) => {
            state.session.entities[session.id] = session;
          })
        })
      },

      getSessionsAnchor: (type, refresh) => {
        return array.getAnchor(get().getSessions("newer"), "id", "-1", type, refresh);
      },


      getAccesses: (type) => {
        const object = get().access.entities;
        if (!object) return [];

        const out: IAccess[] = [];
        const keys = Object.keys(object);
        keys.forEach(key => {
          const access = get().access.entities[key];
          if (access) out.push(access);
        })

        return array.sort(out, "id", ((a, b) => util.compareId(a, b, type === "newer")));
      },

      setAccesses: (accesses, refresh) => {
        set(state => {
          if (refresh) state.access.entities = {};
          if (!accesses) return;

          accesses.forEach((access) => {
            state.access.entities[access.id] = access;
          })
        })
      },

      getAccessesAnchor: (type, refresh) => {
        return array.getAnchor(get().getAccesses("newer"), "id", "-1", type, refresh);
      },


      queryAuth: async () => {
        const res = await sage.get(
          { a: sage.query("auth", undefined) },
          (query) => request(query)
        );

        const authorized = !(!res?.a.data || res.a.error);
        set((state) => { state.authorized = authorized });
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
        if (!token) return false;

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
        if (!token) return false;

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

        if (res?.a.error) {
          switch (res?.a.error) {
            case ErrorCode.UsernameUsed: return "username";
            default: return "error";
          }
        }
        else {
          return "ok";
        }
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
        const anchor = get().getSessionsAnchor(type, refresh);

        const res = await sage.get(
          { a: sage.query("getSessions", { anchor, type }) },
          (query) => request(query)
        );

        const status = !(!res?.a.data || res.a.error);
        const sessions = res?.a.data;

        if (sessions) get().setSessions(sessions, refresh);

        return { status, length: sessions?.length ?? 0 };
      },

      queryTerminateSession: async (sessionId) => {
        const res = await sage.get(
          { a: sage.query("terminateSession", { sessionId }) },
          (query) => request(query)
        );

        const status = !(!res?.a.data || res.a.error);

        if (status) {
          set((state) => { delete state.session.entities[sessionId] });

          // If terminated session is current session, reset state
          if (get().currentSession?.id === sessionId) set(initialState);
        }
      },

      queryGetAccesses: async (type, refresh) => {
        const anchor = get().getAccessesAnchor(type, refresh);

        const res = await sage.get(
          { a: sage.query("getAccesses", { anchor, type }) },
          (query) => request(query)
        );

        const status = !(!res?.a.data || res.a.error);
        const accesses = res?.a.data;

        if (accesses) get().setAccesses(accesses, refresh);

        return { status, length: accesses?.length ?? 0 };
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

        const status = !(!res?.a.data || res.a.error);

        if (status) {
          set((state) => { delete state.access.entities[accessId] });
        }
      },
    }))
  )
}

type UserStore = ReturnType<typeof createUserStore>
type UserProviderProps = React.PropsWithChildren<Partial<State>>

const UserContext = createContext<UserStore | null>(null);
let store: UserStore | undefined = undefined;

export function UserProvider({ children, ...props }: UserProviderProps) {
  if (!store) store = createUserStore(props);

  return (
    <UserContext.Provider value={store}>
      {children}
    </UserContext.Provider>
  )
}

export function useUserStore<T>(
  selector: (state: State & Action) => T,
  equalityFn?: (left: T, right: T) => boolean
): T {
  const store = useContext(UserContext);
  if (!store) throw new Error('Missing UserContext.Provider in the tree');
  return useStore(store, selector, equalityFn);
}

export function userStore() {
  if (!store) throw new Error('Missing UserContext.Provider in the tree');
  return store;
}