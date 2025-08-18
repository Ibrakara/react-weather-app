export default {
  testEnvironment: "jsdom",
  roots: ["<rootDir>/tests/unit"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^@/services/weatherService$": "<rootDir>/__mocks__/services/weatherService.js",
    "^@src/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  transformIgnorePatterns: [],
};