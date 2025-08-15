import { createSlice } from "@reduxjs/toolkit";
import { languages } from "../../constants";

const languageSlice = createSlice({
  name: "language",
  initialState: {
    language: "en",
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
      state.language = state.language === "en" ? "es" : "en";
    },
  },
});

export const { setLanguage, toggleLanguage } = languageSlice.actions;
export default languageSlice.reducer;
