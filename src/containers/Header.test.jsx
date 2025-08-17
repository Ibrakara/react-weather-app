import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./Header";
import React from "react";
import { setLanguage } from "../store/slices/languageSlice";
import { setTheme, toggleTheme } from "../store/slices/themeSlice";

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}));

jest.mock("react-router-dom", () => ({
  Link: ({ to, children }) => <a href={to}>{children}</a>,
}));

jest.mock("../store/slices/languageSlice", () => ({
  setLanguage: jest.fn(),
}));

jest.mock("../store/slices/themeSlice", () => ({
  setTheme: jest.fn(),
  toggleTheme: jest.fn(),
}));

describe("Header", () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    setLanguage.mockClear();
    setTheme.mockClear();
    toggleTheme.mockClear();

    jest.spyOn(require("react-redux"), "useSelector").mockReturnValue({
      language: { language: "en" },
      theme: { mode: "light" },
    });
  });

  test("renders the header title and navigates to home", () => {
    render(<Header />);
    const headerLink = screen.getByRole("link", { name: /Weather App/i });
    expect(headerLink).toBeInTheDocument();
    expect(headerLink).toHaveAttribute("href", "/");
  });

  test("renders language buttons and current language is English", () => {
    render(<Header />);
    const englishButton = screen.getByRole("button", {
      name: /Change to English/i,
    });
    const spanishButton = screen.getByRole("button", {
      name: /Change to Spanish/i,
    });

    expect(englishButton).toBeInTheDocument();
    expect(spanishButton).toBeInTheDocument();
  });

  test("dispatches setLanguage when a new language button is clicked", () => {
    render(<Header />);
    const spanishButton = screen.getByRole("button", {
      name: /Change to Spanish/i,
    });
    fireEvent.click(spanishButton);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(setLanguage).toHaveBeenCalledTimes(1);
    expect(setLanguage).toHaveBeenCalledWith("es-ES");
  });

  test("renders theme toggle button with current theme", () => {
    render(<Header />);
    const themeToggleButton = screen.getByRole("button", {
      name: /Toggle Theme/i,
    });
    expect(themeToggleButton).toBeInTheDocument();
  });

  test("dispatches toggleTheme when theme toggle button is clicked", () => {
    render(<Header />);
    const themeToggleButton = screen.getByRole("button", {
      name: /Toggle Theme/i,
    });
    fireEvent.click(themeToggleButton);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });
});
