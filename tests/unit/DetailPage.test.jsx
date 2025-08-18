import React from "react";
import { render, screen } from "@testing-library/react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import DetailPage from "@src/pages/DetailPage";
import { useWeeklyForecast } from "@src/hooks/useForecastList";
import { getErrorMessage } from "@src/services/helpers";

jest.mock("react-router-dom", () => ({
  useParams: jest.fn(),
  Link: ({ to, children }) => <a href={to}>{children}</a>,
}));

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("@src/hooks/useForecastList", () => ({
  useWeeklyForecast: jest.fn(),
}));

jest.mock("@src/services/helpers", () => ({
  getErrorMessage: jest.fn(),
}));

jest.mock("@src/components/ForecastCard", () => {
  return ({ dateString, iconCode, temp, humidity, windSpeed, description }) => (
    <div data-testid="mock-forecast-card">
      MockForecastCard - {dateString} - {iconCode} - {temp} - {humidity} - {windSpeed} - {description}
    </div>
  );
});

describe("DetailPage", () => {
  beforeEach(() => {
    useParams.mockReset();
    useSelector.mockReset();
    useWeeklyForecast.mockReset();
    getErrorMessage.mockReset();

    useSelector.mockReturnValue("en");
  });

  test("renders loading message when loading", () => {
    useParams.mockReturnValue({ locationDate: "London-2024-01-01" });
    useWeeklyForecast.mockReturnValue({
      isLoading: true,
      data: undefined,
      error: undefined,
    });

    render(<DetailPage />);
    expect(screen.getByText("loading")).toBeInTheDocument();
  });

  test("renders error message when there is an error", () => {
    useParams.mockReturnValue({ locationDate: "London-2024-01-01" });
    const mockError = new Error("Failed to fetch");
    useWeeklyForecast.mockReturnValue({
      isLoading: false,
      data: undefined,
      error: mockError,
    });
    getErrorMessage.mockReturnValue("Error: Failed to fetch data.");

    render(<DetailPage />);
    expect(
      screen.getByText("Error: Failed to fetch data.")
    ).toBeInTheDocument();
  });

  test("renders detailed forecast when data is available", () => {
    useParams.mockReturnValue({ locationDate: "London-2024-01-01" });
    const mockForecastData = {
      city: { timezone: 0 },
      list: [
        {
          dt: 1704067200,
          main: { temp: 280 },
          weather: [{ icon: "01d", description: "clear sky" }],
          wind: { speed: 5 },
        },
        {
          dt: 1704070800,
          main: { temp: 281 },
          weather: [{ icon: "02d", description: "few clouds" }],
          wind: { speed: 7 },
        },
      ],
    };
    useWeeklyForecast.mockReturnValue({
      isLoading: false,
      data: mockForecastData,
      error: undefined,
    });

    render(<DetailPage />);

    expect(screen.getByText("London")).toBeInTheDocument();
    expect(screen.getByText("Monday, January 1, 2024")).toBeInTheDocument();
    expect(screen.getByText(/back to overview/i)).toBeInTheDocument();

    const forecastCards = screen.getAllByTestId("mock-forecast-card");
    expect(forecastCards[0]).toHaveTextContent("clear sky");
    expect(forecastCards[1]).toHaveTextContent("few clouds");
  });

  test("renders no forecast cards if detailedDayData is empty", () => {
    useParams.mockReturnValue({ locationDate: "London-2024-01-01" });
    const mockForecastData = {
      city: { timezone: 0 },
      list: [],
    };
    useWeeklyForecast.mockReturnValue({
      isLoading: false,
      data: mockForecastData,
      error: undefined,
    });

    render(<DetailPage />);

    expect(screen.queryByTestId("forecast-card")).not.toBeInTheDocument();
  });
});
