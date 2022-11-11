import create from "zustand"
import { immer } from 'zustand/middleware/immer'

interface State {
  loading: boolean;
}

interface Action {
  setLoading: (loading: boolean) => void;
}

const initialState: State = {
  loading: true,
}

export const useAppStore = create(immer<State & Action>((set) => ({
  ...initialState,

  setLoading: (loading) => set((state: State) => {
    state.loading = loading;
  }),
})))