import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice";
import locationReducer from "./slices/locationSlice";
import languagleReducer from "./slices/languageSlice";
import { loadState, saveState } from "../services/helpers";

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    location: locationReducer,
    language: languagleReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveState({
    theme: store.getState().theme,
  });
});
