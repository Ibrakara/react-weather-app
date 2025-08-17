import "@testing-library/jest-dom";

// Suppress react-i18next warning about missing i18n instance
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0].includes('react-i18next:: useTranslation: You will need to pass in an i18next instance')) {
    return;
  }
  originalWarn.call(console, ...args);
};