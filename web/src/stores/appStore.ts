import create from "zustand"
import { immer } from 'zustand/middleware/immer'

interface State {
  loading: boolean;
  route: {
    name: string;
    forGuests: boolean;
    forAny: boolean;
  }

  setLoading: (loading: boolean) => void;
  setRoute: (route: Partial<State["route"]>) => void;
}

export const useAppStore = create(immer<State>((set) => ({
  loading: true,
  route: {
    name: "",
    forGuests: true,
    forAny: false,
  },

  setLoading: (loading) => set((state: State) => {
    state.loading = loading;
  }),

  setRoute: (route) => set((state: State) => {
    state.route.name = route.name ?? "";
    state.route.forGuests = route.forGuests ?? false;
    state.route.forAny = route.forAny ?? false;
  }),
})))