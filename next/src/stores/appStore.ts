import create from "zustand";
import { immer } from "zustand/middleware/immer";
import i18n from "../lib/i18n";

interface State {
  loading: {
    locale: boolean;
  }
}

interface Action {
  changeLocale: (lang: string) => void;
}

const initialState: State = {
  loading: {
    locale: true,
  },
};

export const useAppStore = create(
  immer<State & Action>((set, _get) => ({
    ...initialState,

    changeLocale: async (lang) => {
      set((state) => { state.loading.locale = true });

      await Promise.all([i18n.changeLanguage(lang), /*changeDateLanguage(lang)*/]);
      document.documentElement.lang = lang;

      set(state => { state.loading.locale = false })
    },
  }))
);
