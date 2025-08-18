import { render, screen, fireEvent } from "@testing-library/react";
import CustomButton from "@src/components/CustomButton";

describe("CustomButton", () => {
  test("renders children text", () => {
    render(<CustomButton>Click Me</CustomButton>);
    expect(screen.getByText(/Click Me/i)).toBeInTheDocument();
  });

  test("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<CustomButton onClick={handleClick}>Click Me</CustomButton>);

    fireEvent.click(screen.getByText(/Click Me/i));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("applies the title attribute", () => {
    render(<CustomButton title="test-title">Click</CustomButton>);
    expect(screen.getByRole("button")).toHaveAttribute("title", "test-title");
  });
});