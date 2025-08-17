import { configureStore } from "@reduxjs/toolkit";
import { loadState, saveState } from "../services/helpers";
import themeReducer from "./slices/themeSlice";
import locationReducer from "./slices/locationSlice";
import languageReducer, {
  languageListenerMiddleware,
} from "./slices/languageSlice";
import weatherSliceReducer from "./slices/weatherSlice";
import i18n from "../i18n";

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    location: locationReducer,
    language: languageReducer,
    weather: weatherSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(languageListenerMiddleware.middleware),
  preloadedState,
  devTools: process.env.NODE_ENV !== "production",
});

if (preloadedState?.language?.language) {
  i18n.changeLanguage(preloadedState.language.language);
}

store.subscribe(() => {
  saveState({
    theme: store.getState().theme,
    language: store.getState().language,
    location: {
      ...store.getState().location,
      geoLocation: null,
      searchedLocation: null,
      currentLocation: null,
    },
  });
});
