import { render, screen } from "@testing-library/react";
import DailyForecast from "@src/components/DailyForecast";
import React from "react";
import dailyForecastMockData from "@src/test-utils/mocks/dailyForecastMockData";

jest.mock("react-router-dom", () => ({
  Link: ({ to, children, className }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}));

jest.mock("@src/components/ForecastCard", () => {
  return ({ dateString, iconCode, temp, description }) => (
    <div data-testid="mock-forecast-card">
      <span data-testid="mock-date-string">{dateString}</span>
      <span data-testid="mock-icon-code">{iconCode}</span>
      <span data-testid="mock-temp">{temp}</span>
      {description && <span data-testid="mock-description">{description}</span>}
    </div>
  );
});

jest.mock("@src/styles/DailyForecast.module.css", () => ({
  forecastContainer: "forecastContainer",
  dayLink: "dayLink",
}));

describe("DailyForecast", () => {
  const mockLocationName = "London";

  test("renders null if data is empty", () => {
    const { container } = render(
      <DailyForecast data={[]} locationName={mockLocationName} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("renders null if data is null", () => {
    const { container } = render(
      <DailyForecast data={null} locationName={mockLocationName} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("renders a link and ForecastCard for each data item", () => {
    render(
      <DailyForecast
        data={dailyForecastMockData}
        locationName={mockLocationName}
      />
    );

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(dailyForecastMockData.length);

    links.forEach((link, index) => {
      const item = dailyForecastMockData[index];
      expect(link).toHaveAttribute(
        "href",
        `/detail/${mockLocationName}-${item.urlDate}`
      );
      expect(link).toHaveClass("dayLink");

      const forecastCard = link.querySelector(
        '[data-testid="mock-forecast-card"]'
      );
      expect(forecastCard).toBeInTheDocument();
      expect(forecastCard).toHaveTextContent(item.date);
      expect(forecastCard).toHaveTextContent(item.icon);
      expect(forecastCard).toHaveTextContent(`${item.min} - ${item.max}`);
    });
  });

  test("applies the forecastContainer class", () => {
    render(
      <DailyForecast
        data={dailyForecastMockData}
        locationName={mockLocationName}
      />
    );
    const firstForecastCard = screen.getAllByTestId("mock-forecast-card")[0];
    const container = firstForecastCard.closest(".forecastContainer");
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass("forecastContainer");
  });
});