import { createContext, useContext } from "react";
import { createStore, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";

interface State {
  options: {
    dashboard: {
      feed: "sessions" | "accesses";
      sessionOrder: "newer" | "older";
      accessOrder: "newer" | "older";
    }
  }
}

interface Action {

}

const initialState: State = {
  options: {
    dashboard: {
      feed: "sessions",
      sessionOrder: "newer",
      accessOrder: "newer",
    }
  }
}

export const createAppStore = (props?: Partial<State>) => {
  return createStore(
    immer<State & Action>((_set, _get) => ({
      ...initialState,
      ...props,
    }))
  )
}

type AppStore = ReturnType<typeof createAppStore>
type AppProviderProps = React.PropsWithChildren<Partial<State>>

const AppContext = createContext<AppStore | null>(null);
let store: AppStore | undefined = undefined;

export function AppProvider({ children, ...props }: AppProviderProps) {
  if (!store) store = createAppStore(props);

  return (
    <AppContext.Provider value={store}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppStore<T>(
  selector: (state: State & Action) => T,
  equalityFn?: (left: T, right: T) => boolean
): T {
  const store = useContext(AppContext);
  if (!store) throw new Error('Missing AppContext.Provider in the tree');
  return useStore(store, selector, equalityFn);
}

export function appStore() {
  if (!store) throw new Error('Missing AppContext.Provider in the tree');
  return store;
}