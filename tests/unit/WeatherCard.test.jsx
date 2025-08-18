import { render, screen, fireEvent } from "@testing-library/react";
import WeatherCard from "@src/components/WeatherCard";
import React from "react";
import { removeSearchedLocation } from "@src/store/slices/locationSlice";

jest.mock("@src/components/WeatherIcon", () => {
  return ({ iconCode, size, className }) => (
    <div data-testid="mock-weather-icon" className={className}>
      MockWeatherIcon - {iconCode} - {size}
    </div>
  );
});

jest.mock("@src/components/DailyForecast", () => {
  return ({ data, locationName }) => (
    <div data-testid="mock-daily-forecast">
      MockDailyForecast - {locationName} - {data ? data.length : 0} items
    </div>
  );
});

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

jest.mock("@src/store/slices/locationSlice", () => ({
  removeSearchedLocation: jest.fn((payload) => ({
    type: "LOCATION_REMOVE",
    payload,
  })),
}));

describe("WeatherCard", () => {
  const mockWeatherData = {
    name: "London",
    main: { temp: 15 },
    weather: [{ description: "clear sky", icon: "01d" }],
  };

  const mockForecastData = [
    { date: "Mon", urlDate: "2025-08-17", icon: "01d", min: 10, max: 20 },
  ];

  beforeEach(() => {
    mockDispatch.mockClear();
    removeSearchedLocation.mockClear();
  });

  test("renders weather data correctly", () => {
    render(
      <WeatherCard
        weatherData={mockWeatherData}
        forecastData={mockForecastData}
      />
    );

    expect(screen.getByText("London")).toBeInTheDocument();
    expect(screen.getByText("15°C")).toBeInTheDocument();
    expect(screen.getByText("clear sky")).toBeInTheDocument();

    const weatherIcon = screen.getByTestId("mock-weather-icon");
    expect(weatherIcon).toBeInTheDocument();
    expect(weatherIcon).toHaveTextContent("MockWeatherIcon - 01d - 80");

    const dailyForecast = screen.getByTestId("mock-daily-forecast");
    expect(dailyForecast).toBeInTheDocument();
    expect(dailyForecast).toHaveTextContent(
      "MockDailyForecast - London - 1 items"
    );
  });

  test("does not render close button if isRemovable is false", () => {
    render(
      <WeatherCard
        weatherData={mockWeatherData}
        forecastData={mockForecastData}
        isRemovable={false}
      />
    );
    expect(
      screen.queryByRole("button", { name: /Remove location/i })
    ).not.toBeInTheDocument();
  });

  test("dispatches removeSearchedLocation when close button is clicked", () => {
    const searchedName = "London";
    render(
      <WeatherCard
        weatherData={mockWeatherData}
        forecastData={mockForecastData}
        isRemovable={true}
        searchedName={searchedName}
      />
    );

    const closeButton = screen.getByRole("button", { name: /Remove location/i });
    fireEvent.click(closeButton);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(removeSearchedLocation).toHaveBeenCalledTimes(1);
    expect(removeSearchedLocation).toHaveBeenCalledWith(searchedName);
  });

  test("renders 'No weather data to display.' if weatherData is missing", () => {
    render(<WeatherCard weatherData={null} forecastData={mockForecastData} />);
    expect(screen.getByText("No weather data to display.")).toBeInTheDocument();
  });

  test("renders 'No weather data to display.' if weatherData.main is missing", () => {
    const incompleteWeatherData = { ...mockWeatherData, main: undefined };
    render(
      <WeatherCard
        weatherData={incompleteWeatherData}
        forecastData={mockForecastData}
      />
    );
    expect(screen.getByText("No weather data to display.")).toBeInTheDocument();
  });

  test("renders 'No weather data to display.' if weatherData.weather is missing", () => {
    const incompleteWeatherData = { ...mockWeatherData, weather: undefined };
    render(
      <WeatherCard
        weatherData={incompleteWeatherData}
        forecastData={mockForecastData}
      />
    );
    expect(screen.getByText("No weather data to display.")).toBeInTheDocument();
  });
});
