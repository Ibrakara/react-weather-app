import { createSlice } from "@reduxjs/toolkit";

const languageSlice = createSlice({
  name: "language",
  initialState: {
    language: "en",
    supportedLanguages: ["en", "es"],
  },
  reducers: {
    setLanguage: (state, action) => {
      if (
        state.supportedLanguages.includes(action.payload) &&
        action.payload !== state.language
      ) {
        state.language = action.payload;
      }
    },
    toggleLanguage: (state) => {
      state.language = state.language === "en" ? "es" : "en";
    },
  },
});

export const { setLanguage, toggleLanguage } = languageSlice.actions;
export default languageSlice.reducer;
