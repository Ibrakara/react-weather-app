import { configureStore } from "@reduxjs/toolkit";
import { loadState, saveState } from "../services/helpers";
import themeReducer from "./slices/themeSlice";
import locationReducer from "./slices/locationSlice";
import languagleReducer from "./slices/languageSlice";
import weatherSliceReducer from "./slices/weatherSlice";

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    location: locationReducer,
    language: languagleReducer,
    weather: weatherSliceReducer,
  },
  preloadedState,
  devTools: process.env.NODE_ENV !== "production",
});

store.subscribe(() => {
  saveState({
    theme: store.getState().theme,
  });
});
