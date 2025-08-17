import React from "react";
import { render, screen } from "@testing-library/react";
import ErrorPage from "./ErrorPage";

jest.mock("react-router-dom", () => ({
  Link: ({ to, children }) => <a href={to}>{children}</a>,
}));

describe("ErrorPage", () => {
  test("renders with default error message and code", () => {
    render(<ErrorPage />);

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Oops! Something went wrong.")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Page not found. The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Go to Home" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go to Home" })).toHaveAttribute(
      "href",
      "/"
    );
  });

  test("renders with custom error message and code", () => {
    const customErrorCode = "500";
    const customMessage = "Internal Server Error.";
    render(<ErrorPage errorCode={customErrorCode} message={customMessage} />);

    expect(screen.getByText(customErrorCode)).toBeInTheDocument();
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });
});
