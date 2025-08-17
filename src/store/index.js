import { configureStore } from "@reduxjs/toolkit";
import { loadState } from "../services/helpers";
import themeReducer from "./slices/themeSlice";
import locationReducer from "./slices/locationSlice";
import languageReducer, {
  languageListenerMiddleware,
} from "./slices/languageSlice";
import weatherSliceReducer from "./slices/weatherSlice";
import i18n from "../i18n";
import { localStorageMiddleware } from "./middleware/localStorageMiddleware";

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    location: locationReducer,
    language: languageReducer,
    weather: weatherSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(
      languageListenerMiddleware.middleware,
      localStorageMiddleware
    ),
  preloadedState,
  devTools: import.meta.env.DEV,
});

if (preloadedState?.language?.language) {
  i18n.changeLanguage(preloadedState.language.language);
}
