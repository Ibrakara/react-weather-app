import { configureStore } from "@reduxjs/toolkit";
import languageReducer, {
  setLanguage,
  toggleLanguage,
  languageListenerMiddleware,
} from "@src/store/slices/languageSlice";
import { languages } from "@src/constants";
import i18n from "@src/i18n/index";

jest.mock("@src/i18n/index", () => ({
  changeLanguage: jest.fn(),
}));

describe("languageSlice", () => {
  let store;

  let consoleWarnSpy;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        language: languageReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(languageListenerMiddleware.middleware),
    });
    i18n.changeLanguage.mockClear();
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  it("should return the initial state", () => {
    expect(store.getState().language.language).toBe(languages.en);
    expect(store.getState().language.supportedLanguages).toEqual([
      languages.en,
      languages.es,
    ]);
  });

  it("should handle setLanguage to a supported language", () => {
    store.dispatch(setLanguage(languages.es));
    expect(store.getState().language.language).toBe(languages.es);
    expect(i18n.changeLanguage).toHaveBeenCalledWith(languages.es);
  });

  it("should not change language if not supported", () => {
    const unsupportedLang = "fr";
    store.dispatch(setLanguage(unsupportedLang));
    expect(store.getState().language.language).toBe(languages.en);
    expect(i18n.changeLanguage).not.toHaveBeenCalledWith(unsupportedLang);
  });

  it("should handle toggleLanguage from en to es", () => {
    store.dispatch(toggleLanguage());
    expect(store.getState().language.language).toBe(languages.es);
    expect(i18n.changeLanguage).toHaveBeenCalledWith(languages.es);
  });

  it("should handle toggleLanguage from es to en", () => {
    store.dispatch(toggleLanguage());
    expect(store.getState().language.language).toBe(languages.es);
    i18n.changeLanguage.mockClear();

    store.dispatch(toggleLanguage());
    expect(store.getState().language.language).toBe(languages.en);
    expect(i18n.changeLanguage).toHaveBeenCalledWith(languages.en);
  });
});