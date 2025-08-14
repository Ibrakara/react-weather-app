import { configureStore } from "@reduxjs/toolkit";
import { loadState, saveState } from "../services/helpers";
import themeReducer from "./slices/themeSlice";
import locationReducer from "./slices/locationSlice";
import languagleReducer from "./slices/languageSlice";
import weatherSliceReducer from "./slices/wheaterSlice";

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    location: locationReducer,
    language: languagleReducer,
    weather: weatherSliceReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveState({
    theme: store.getState().theme,
  });
});
