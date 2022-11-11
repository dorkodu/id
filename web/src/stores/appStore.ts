import { useNavigate } from "react-router-dom";
import create from "zustand"
import { immer } from 'zustand/middleware/immer'
import { routes, Routes } from "../routes/_routes";
import { useUserStore } from "./userStore";

interface State {
  loading: boolean;
  route: (keyof Routes) | undefined;
}

interface Action {
  setLoading: (loading: boolean) => void;
  setRoute: (route: State["route"]) => void;
}

const initialState: State = {
  loading: true,
  route: undefined,
}

export const useAppStore = create(immer<State & Action>((set) => ({
  ...initialState,

  setLoading: (loading) => set((state: State) => {
    state.loading = loading;
  }),

  setRoute: (route) => set((state: State) => {
    state.route = route;
  }),
})))

export function useSetRoute() {
  const user = useUserStore(state => state.user);
  const setRoute = useAppStore(state => state.setRoute);
  const navigate = useNavigate();

  return (route: keyof Routes) => {
    if (user && routes[route].forGuests) {
      setRoute("dashboard");
      navigate(routes["dashboard"].path);
    }
    else if (!user && !routes[route].forGuests) {
      setRoute("welcome");
      navigate(routes["welcome"].path);
    }
    else {
      setRoute(route);
      navigate(routes[route].path);
    }
  }
}