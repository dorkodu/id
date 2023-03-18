import i18n from "@/lib/web/i18n";
import create from "zustand";
import { immer } from "zustand/middleware/immer";

interface State {
  loading: {
    auth: boolean;
    locale: boolean;
  };

  redirect: string | undefined;
  route: "menu" | "any";

  options: {
    dashboard: {
      feed: "sessions" | "accesses";
      sessionOrder: "newer" | "older";
      accessOrder: "newer" | "older";
    }
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
    dashboard: {
      feed: "sessions",
      sessionOrder: "newer",
      accessOrder: "newer",
    }
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
      if (typeof window !== "undefined") {
        set((state) => { state.loading.locale = true });
        await Promise.all([i18n.changeLanguage(lang), /*changeDateLanguage(lang)*/]);
        document.documentElement.lang = lang;
        set(state => { state.loading.locale = false });
      }
    },

    setRedirect: (redirect) => {
      set(state => { state.redirect = redirect });
    },
  }))
);
