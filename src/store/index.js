import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice";
import locationReducer from "./slices/locationSlice";
import languagleReducer from "./slices/languageSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    location: locationReducer,
    language: languagleReducer,
  },
});
