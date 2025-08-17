import { renderHook, act } from "@testing-library/react";
import { useQuery } from "@tanstack/react-query";
import { useWeeklyForecast } from "./useForecastList";

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

jest.mock("../services/weatherService", () => ({
  getThreeHourlyForecast: jest.fn(),
}));
jest.mock("../services/helpers", () => ({
  getDailyForecast: jest.fn(),
}));

import { getThreeHourlyForecast } from "../services/weatherService";
import { getDailyForecast } from "../services/helpers";

describe("useWeeklyForecast", () => {
  beforeEach(() => {
    useQuery.mockReset();
    getThreeHourlyForecast.mockReset();
    getDailyForecast.mockReset();
  });

  test("should call useQuery with correct parameters and processData true", async () => {
    const mockData = { list: [] };
    const processedData = { daily: [] };

    getThreeHourlyForecast.mockResolvedValue(mockData);
    getDailyForecast.mockReturnValue(processedData);

    useQuery.mockImplementationOnce(({ queryFn, select }) => {
      return {
        data: queryFn().then(select),
        isLoading: false,
        error: null,
        isSuccess: true,
      };
    });

    const lat = 10;
    const lon = 20;
    const locationName = "London";
    const queryKey = ["weeklyForecast", lat, lon, locationName];

    let result;
    await act(async () => {
      ({ result } = renderHook(() =>
        useWeeklyForecast(lat, lon, locationName, true, queryKey, true)
      ));
    });

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: queryKey,
      queryFn: expect.any(Function),
      staleTime: 1000 * 60 * 5,
      enabled: true,
      retry: false,
      select: getDailyForecast,
    });

    expect(getThreeHourlyForecast).toHaveBeenCalledWith(locationName, lat, lon);
    expect(getDailyForecast).toHaveBeenCalledWith(mockData);
    await expect(result.current.data).resolves.toEqual(processedData);
  });

  test("should call useQuery with correct parameters and processData false", () => {
    const mockData = { list: [] };

    getThreeHourlyForecast.mockResolvedValue(mockData);
    useQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
      isSuccess: true,
    });

    const lat = 10;
    const lon = 20;
    const locationName = "London";
    const queryKey = ["weeklyForecast", lat, lon, locationName];

    const { result } = renderHook(() =>
      useWeeklyForecast(lat, lon, locationName, false, queryKey, true)
    );

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: queryKey,
      queryFn: expect.any(Function),
      staleTime: 1000 * 60 * 5,
      enabled: true,
      retry: false,
      select: undefined,
    });

    const { queryFn } = useQuery.mock.calls[0][0];
    queryFn();

    expect(getThreeHourlyForecast).toHaveBeenCalledWith(locationName, lat, lon);
    expect(getDailyForecast).not.toHaveBeenCalled();
    expect(result.current.data).toEqual(mockData);
  });

  test("should pass enabled: false to useQuery when enabled parameter is false", () => {
    useQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      isSuccess: false,
    });

    const lat = 10;
    const lon = 20;
    const locationName = "London";
    const queryKey = ["weeklyForecast", lat, lon, locationName];

    renderHook(() =>
      useWeeklyForecast(lat, lon, locationName, true, queryKey, false)
    );

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      })
    );
  });

  test("should use default queryKey if not provided", () => {
    useQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      isSuccess: false,
    });

    const lat = 10;
    const lon = 20;
    const locationName = "London";

    renderHook(() =>
      useWeeklyForecast(lat, lon, locationName, true, undefined, true)
    );

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["weeklyForecast", lat, lon, locationName],
      })
    );
  });
});
