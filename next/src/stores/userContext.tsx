import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";
import { createUserStore, UserAction, UserState } from "./userStore";

export type UserStore = ReturnType<typeof createUserStore>
export const UserContext = createContext<UserStore | null>(null);

type UserProviderProps = React.PropsWithChildren<Partial<UserState>>

export function UserProvider({ children, ...props }: UserProviderProps) {
  const storeRef = useRef<UserStore>();
  if (!storeRef.current) storeRef.current = createUserStore(props);

  return (
    <UserContext.Provider value={storeRef.current}>
      {children}
    </UserContext.Provider>
  )
}

export function useUserContext<T>(
  selector: (state: UserState & UserAction) => T,
  equalityFn?: (left: T, right: T) => boolean
): T {
  const store = useContext(UserContext);
  if (!store) throw new Error('Missing UserContext.Provider in the tree');
  return useStore(store, selector, equalityFn);
}