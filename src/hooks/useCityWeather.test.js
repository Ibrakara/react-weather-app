import { renderHook, act } from "@testing-library/react";
import { useQuery } from "@tanstack/react-query";
import { useCityWeather } from "./useCityWeather";
import { getCurrentWeather } from "../services/weatherService";

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

jest.mock("../services/weatherService", () => ({
  getCurrentWeather: jest.fn(),
}));

describe("useCityWeather", () => {
  beforeEach(() => {
    useQuery.mockReset();
    getCurrentWeather.mockReset();
  });

  test("should call useQuery with correct parameters when lat and lon are provided", async () => {
    const lat = 10;
    const lon = 20;
    const locationName = "London";
    const mockWeatherData = { name: "London", main: { temp: 20 } };

    getCurrentWeather.mockResolvedValue(mockWeatherData);
    useQuery.mockImplementationOnce(({ queryFn }) => ({
      data: queryFn(),
      isLoading: false,
      error: null,
      isSuccess: true,
    }));

    const { result } = renderHook(() => useCityWeather(lat, lon, locationName));

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ["currentWeather", lat, lon, locationName],
      queryFn: expect.any(Function),
      staleTime: 1000 * 60 * 5,
      enabled: true,
      refetchOnWindowFocus: true,
      refetchInterval: 1000 * 60 * 5,
      retry: false,
    });

    const { queryFn } = useQuery.mock.calls[0][0];
    await act(async () => {
      await queryFn();
    });

    expect(getCurrentWeather).toHaveBeenCalledWith(locationName, lat, lon);
    await expect(result.current.data).resolves.toEqual(mockWeatherData);
  });

  test("should call useQuery with correct parameters when only locationName is provided", async () => {
    const lat = undefined;
    const lon = undefined;
    const locationName = "Paris";
    const mockWeatherData = { name: "Paris", main: { temp: 15 } };

    getCurrentWeather.mockResolvedValue(mockWeatherData);
    useQuery.mockImplementationOnce(({ queryFn }) => ({
      data: queryFn(),
      isLoading: false,
      error: null,
      isSuccess: true,
    }));

    const { result } = renderHook(() => useCityWeather(lat, lon, locationName));

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ["currentWeather", lat, lon, locationName],
      queryFn: expect.any(Function),
      staleTime: 1000 * 60 * 5,
      enabled: true,
      refetchOnWindowFocus: true,
      refetchInterval: 1000 * 60 * 5,
      retry: false,
    });

    const { queryFn } = useQuery.mock.calls[0][0];
    await act(async () => {
      await queryFn();
    });

    expect(getCurrentWeather).toHaveBeenCalledWith(locationName, lat, lon);
    await expect(result.current.data).resolves.toEqual(mockWeatherData);
  });

  test("should set enabled to false when no lat, lon, or locationName is provided", () => {
    useQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      isSuccess: false,
    });

    renderHook(() => useCityWeather(undefined, undefined, undefined));

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

    renderHook(() => useCityWeather(lat, lon, locationName, undefined));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["currentWeather", lat, lon, locationName],
      })
    );
  });
});
