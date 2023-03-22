import { create } from "zustand";
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
};

export const useAppStore = create(
  immer<State & Action>((_set, _get) => ({
    ...initialState,
  }))
);
