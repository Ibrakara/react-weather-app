import { render, screen } from "@testing-library/react";
import WeatherIcon from "./WeatherIcon";

jest.mock("react-icons/wi", () => require("../../_mocks_/react-icons/wi"));

describe("WeatherIcon", () => {
  test("renders the correct icon for a known code", () => {
    render(<WeatherIcon iconCode="01d" data-testid="icon" />);
    const Icon = screen.getByTestId("icon");
    expect(Icon).toBeInTheDocument();
    expect(Icon.className).toContain("weatherIcon");
  });

  test("renders fallback icon for unknown code", () => {
    render(<WeatherIcon iconCode="unknown" data-testid="icon" />);
    const Icon = screen.getByTestId("icon");
    expect(Icon).toBeInTheDocument();
  });

  test("applies additional className prop", () => {
    render(
      <WeatherIcon iconCode="01d" className="customClass" data-testid="icon" />
    );
    const Icon = screen.getByTestId("icon");
    expect(Icon.className).toContain("weatherIcon");
    expect(Icon.className).toContain("customClass");
  });

  test("renders WiNa for unknown iconCode", () => {
    render(<WeatherIcon iconCode="invalid" data-testid="icon" />);
    const Icon = screen.getByTestId("icon");
    expect(Icon).toBeInTheDocument();
    expect(Icon.textContent).toBe("WiNa");
  });
});
