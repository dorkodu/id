import { useWait } from "@/components/hooks";
import create from "zustand";
import { immer } from "zustand/middleware/immer";
import i18n from "../lib/i18n";

interface State {
  loading: {
    auth: boolean;
    locale: boolean;
  };

  redirect: string | undefined;
  route: "menu" | "any";

  options: {
    sessions: { order: "newer" | "older" };
    accesses: { order: "newer" | "older" };
  }
}

interface Action {
  setAuthLoading: (loading: boolean) => void;
  setLocaleLoading: (loading: boolean) => void;
  changeLocale: (lang: string) => void;

  setRedirect: (redirect: string | undefined) => void;
}

const initialState: State = {
  loading: {
    auth: true,
    locale: true,
  },

  redirect: undefined,
  route: "any",

  options: {
    sessions: { order: "newer" },
    accesses: { order: "newer" },
  }
};

export const useAppStore = create(
  immer<State & Action>((set, _get) => ({
    ...initialState,

    setAuthLoading: (loading) => {
      set((state) => { state.loading.auth = loading });
    },

    setLocaleLoading: (loading) => {
      set((state) => { state.loading.locale = loading });
    },

    changeLocale: async (lang) => {
      set((state) => { state.loading.locale = true });

      await useWait(async () => {
        await i18n.changeLanguage(lang);
        document.documentElement.lang = lang;
      })();

      set(state => { state.loading.locale = false })
    },

    setRedirect: (redirect) => {
      set(state => { state.redirect = redirect });
    },
  }))
);
