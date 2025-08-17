import { render, screen } from "@testing-library/react";
import ErrorMessage from "./ErrorMessage";
import React from "react";

jest.mock("react-icons/fa", () => ({
  FaExclamationTriangle: ({ className }) => (
    <div data-testid="mock-exclamation-icon" className={className}></div>
  ),
}));

describe("ErrorMessage", () => {
  test("renders the provided message", () => {
    const testMessage = "This is a test error message.";
    render(<ErrorMessage message={testMessage} />);
    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });

  test("renders the exclamation icon", () => {
    render(<ErrorMessage message="Test" />);
    expect(screen.getByTestId("mock-exclamation-icon")).toBeInTheDocument();
  });

  test("applies correct class names", () => {
    const testMessage = "Test message";
    render(<ErrorMessage message={testMessage} />);

    const errorContainer = screen.getByText(testMessage).closest("div");
    expect(errorContainer).toHaveClass("errorContainer");
    expect(screen.getByText(testMessage)).toHaveClass("errorMessage");
    expect(screen.getByTestId("mock-exclamation-icon")).toHaveClass(
      "errorIcon"
    );
  });
});
