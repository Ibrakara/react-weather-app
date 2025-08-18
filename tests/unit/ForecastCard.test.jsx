import { render, screen } from "@testing-library/react";
import ForecastCard from "@src/components/ForecastCard";
import React from "react";

jest.mock("@src/components/WeatherIcon", () => {
  return ({ iconCode, size, className }) => (
    <div data-testid="mock-weather-icon" className={className}>
      MockWeatherIcon - {iconCode} - {size}
    </div>
  );
});

describe("ForecastCard", () => {
  const defaultProps = {
    dateString: "Mon, 17 Aug",
    iconCode: "01d",
    temp: 25,
    description: "Clear Sky",
  };

  test("renders all provided props correctly", () => {
    render(<ForecastCard {...defaultProps} />);

    expect(screen.getByText(defaultProps.dateString)).toBeInTheDocument();
    expect(screen.getByText(`${defaultProps.temp}°C`)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();

    const weatherIcon = screen.getByTestId("mock-weather-icon");
    expect(weatherIcon).toBeInTheDocument();
    expect(weatherIcon).toHaveTextContent(
      `MockWeatherIcon - ${defaultProps.iconCode} - 40`
    );
  });

  test("does not render description if not provided", () => {
    const { description, ...propsWithoutDescription } = defaultProps;
    render(<ForecastCard {...propsWithoutDescription} />);

    expect(screen.queryByText(description)).not.toBeInTheDocument();
  });

  test("applies correct class names", () => {
    render(<ForecastCard {...defaultProps} />);
    const cardElement = screen
      .getByText(defaultProps.dateString)
      .closest("div");
    expect(cardElement).toHaveClass("card");
    expect(screen.getByText(defaultProps.dateString)).toHaveClass("dateTime");
    expect(screen.getByText(`${defaultProps.temp}°C`)).toHaveClass("temp");
    expect(screen.getByText(defaultProps.description)).toHaveClass(
      "description"
    );
    expect(screen.getByTestId("mock-weather-icon")).toHaveClass("icon");
  });
});