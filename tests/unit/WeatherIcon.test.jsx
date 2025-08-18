import { render, screen } from "@testing-library/react";
import WeatherIcon from "@src/components/WeatherIcon";

jest.mock("react-icons/wi", () => {
  const mockComponents = new Proxy({}, {
    get: (target, name) => {
      if (name === "__esModule") return true;
      return ({ size, className }) => (
        <div data-testid={`mock-wi-${name}`} style={{ fontSize: size }} className={className}>
          {name}
        </div>
      );
    },
  });
  return mockComponents;
});

describe("WeatherIcon", () => {
  test("renders the correct icon for a known code", () => {
    render(<WeatherIcon iconCode="01d" data-testid="icon" />);
    const Icon = screen.getByTestId("mock-wi-WiDaySunny"); // Changed data-testid to match mock
    expect(Icon).toBeInTheDocument();
    expect(Icon.className).toContain("weatherIcon");
  });

  test("renders fallback icon for unknown code", () => {
    render(<WeatherIcon iconCode="unknown" data-testid="icon" />);
    const Icon = screen.getByTestId("mock-wi-WiNa"); // Changed data-testid to match mock
    expect(Icon).toBeInTheDocument();
  });

  test("applies additional className prop", () => {
    render(
      <WeatherIcon iconCode="01d" className="customClass" data-testid="icon" />
    );
    const Icon = screen.getByTestId("mock-wi-WiDaySunny"); // Changed data-testid to match mock
    expect(Icon.className).toContain("weatherIcon");
    expect(Icon.className).toContain("customClass");
  });

  test("renders WiNa for unknown iconCode", () => {
    render(<WeatherIcon iconCode="invalid" data-testid="icon" />);
    const Icon = screen.getByTestId("mock-wi-WiNa"); // Changed data-testid to match mock
    expect(Icon).toBeInTheDocument();
    expect(Icon.textContent).toBe("WiNa");
  });
});