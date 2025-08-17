import { renderHook } from "@testing-library/react";
import { useWeatherAndForecast } from "./useWeatherAndForecast";
import { useCityWeather } from "./useCityWeather";
import { useWeeklyForecast } from "./useForecastList";

jest.mock("./useCityWeather");
jest.mock("./useForecastList");

describe("useWeatherAndForecast", () => {
  beforeEach(() => {
    useCityWeather.mockReset();
    useWeeklyForecast.mockReset();
  });

  test("should return combined data when both hooks are successful", () => {
    useCityWeather.mockReturnValue({
      data: { coord: { lat: 10, lon: 20 }, name: "London" },
      isLoading: false,
      error: null,
      isSuccess: true,
    });
    useWeeklyForecast.mockReturnValue({
      data: { daily: [] },
      isLoading: false,
      error: null,
      isSuccess: true,
    });

    const { result } = renderHook(() =>
      useWeatherAndForecast("London", 10, 20)
    );

    expect(result.current.weatherData).toEqual({
      coord: { lat: 10, lon: 20 },
      name: "London",
    });
    expect(result.current.forecastData).toEqual({ daily: [] });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isSuccess).toBe(true);
  });

  test("should return isLoading true if weather hook is loading", () => {
    useCityWeather.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      isSuccess: false,
    });
    useWeeklyForecast.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      isSuccess: false,
    });

    const { result } = renderHook(() =>
      useWeatherAndForecast("London", 10, 20)
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isSuccess).toBe(false);
  });

  test("should return isLoading true if forecast hook is loading", () => {
    useCityWeather.mockReturnValue({
      data: { coord: { lat: 10, lon: 20 }, name: "London" },
      isLoading: false,
      error: null,
      isSuccess: true,
    });
    useWeeklyForecast.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      isSuccess: false,
    });

    const { result } = renderHook(() =>
      useWeatherAndForecast("London", 10, 20)
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isSuccess).toBe(false);
  });

  test("should return error if weather hook has an error", () => {
    const weatherError = new Error("Weather fetch failed");
    useCityWeather.mockReturnValue({
      data: null,
      isLoading: false,
      error: weatherError,
      isSuccess: false,
    });
    useWeeklyForecast.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      isSuccess: false,
    });

    const { result } = renderHook(() =>
      useWeatherAndForecast("London", 10, 20)
    );

    expect(result.current.error).toBe(weatherError);
    expect(result.current.isSuccess).toBe(false);
  });

  test("should return error if forecast hook has an error", () => {
    const forecastError = new Error("Forecast fetch failed");
    useCityWeather.mockReturnValue({
      data: { coord: { lat: 10, lon: 20 }, name: "London" },
      isLoading: false,
      error: null,
      isSuccess: true,
    });
    useWeeklyForecast.mockReturnValue({
      data: null,
      isLoading: false,
      error: forecastError,
      isSuccess: false,
    });

    const { result } = renderHook(() =>
      useWeatherAndForecast("London", 10, 20)
    );

    expect(result.current.error).toBe(forecastError);
    expect(result.current.isSuccess).toBe(false);
  });

  test("should pass correct arguments to useWeeklyForecast", () => {
    useCityWeather.mockReturnValue({
      data: { coord: { lat: 10, lon: 20 }, name: "London" },
      isLoading: false,
      error: null,
      isSuccess: true,
    });
    useWeeklyForecast.mockReturnValue({
      data: { daily: [] },
      isLoading: false,
      error: null,
      isSuccess: true,
    });

    renderHook(() => useWeatherAndForecast("London", 10, 20));

    expect(useWeeklyForecast).toHaveBeenCalledWith(
      10,
      20,
      "London",
      true,
      ["weeklyForecast", 10, 20, "London"],
      true
    );
  });

  test("should not call useWeeklyForecast if weatherData is not available", () => {
    useCityWeather.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      isSuccess: false,
    });
    useWeeklyForecast.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      isSuccess: false,
    });

    renderHook(() => useWeatherAndForecast("London", 10, 20));

    expect(useWeeklyForecast).toHaveBeenCalledWith(
      undefined,
      undefined,
      "London",
      true,
      ["weeklyForecast", undefined, undefined, "London"],
      false
    );
  });
});
