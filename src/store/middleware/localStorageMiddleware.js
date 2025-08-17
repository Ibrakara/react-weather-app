import { saveState } from "../../services/helpers";

export const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  if (
    action.type.startsWith("theme/") ||
    action.type.startsWith("language/") ||
    action.type.startsWith("location/")
  ) {
    const { theme, language, location } = store.getState();
    saveState({
      theme,
      language,
      location: {
        searchedLocations: location.searchedLocations,
      },
    });
  }
  return result;
};
