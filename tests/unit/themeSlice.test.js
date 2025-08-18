import { configureStore } from "@reduxjs/toolkit";
import themeReducer, { toggleTheme } from "@src/store/slices/themeSlice";

describe("themeSlice", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        theme: themeReducer,
      },
    });
  });

  it("should return the initial state", () => {
    expect(store.getState().theme.mode).toBe("light");
  });

  it("should handle toggleTheme from light to dark", () => {
    store.dispatch(toggleTheme());
    expect(store.getState().theme.mode).toBe("dark");
  });

  it("should handle toggleTheme from dark to light", () => {
    store.dispatch(toggleTheme());
    expect(store.getState().theme.mode).toBe("dark");

    store.dispatch(toggleTheme());
    expect(store.getState().theme.mode).toBe("light");
  });
});