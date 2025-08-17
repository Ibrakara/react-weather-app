import { createSlice, createListenerMiddleware } from "@reduxjs/toolkit";
import { languages } from "../../constants";
import i18n from "../../i18n/index";

export const languageListenerMiddleware = createListenerMiddleware();

const languageSlice = createSlice({
  name: "language",
  initialState: {
    language: languages.en,
    supportedLanguages: [languages.en, languages.es],
  },
  reducers: {
    setLanguage: (state, action) => {
      if (!state.supportedLanguages.includes(action.payload)) {
        console.warn(`Language ${action.payload} is not supported.`);
        return;
      }
      state.language = action.payload;
    },
    toggleLanguage: (state) => {
      state.language =
        state.language === languages.en ? languages.es : languages.en;
    },
  },
});

export const { setLanguage, toggleLanguage } = languageSlice.actions;

languageListenerMiddleware.startListening({
  actionCreator: setLanguage,
  effect: (action, listenerApi) => {
    const currentLanguage = listenerApi.getState().language.language;
    if (currentLanguage === action.payload) {
      i18n.changeLanguage(action.payload);
    }
  },
});

languageListenerMiddleware.startListening({
  actionCreator: toggleLanguage,
  effect: (_, listenerApi) => {
    const { language } = listenerApi.getState().language;
    i18n.changeLanguage(language);
  },
});

export default languageSlice.reducer;
