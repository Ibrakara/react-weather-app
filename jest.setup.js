import "@testing-library/jest-dom";

global.TextEncoder = require("util").TextEncoder;

jest.mock("i18next", () => ({
  use: () => ({
    init: jest.fn().mockReturnThis(),
  }),
  init: jest.fn().mockReturnThis(),
  t: (key) => key,
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
  initReactI18next: {},
}));

jest.mock("./src/services/weatherService", () =>
  jest.requireActual("./__mocks__/src/services/weatherService")
);

jest.mock("./src/store/index.js", () => ({
  store: {
    dispatch: jest.fn(),
    getState: jest.fn(),
    subscribe: jest.fn(),
    replaceReducer: jest.fn(),
  },
}));

const mockGeolocation = {
  getCurrentPosition: jest.fn((success, error) =>
    error({ code: 1, message: "User denied Geolocation" })
  ),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
};

Object.defineProperty(global.navigator, "geolocation", {
  value: mockGeolocation,
  writable: true,
});
