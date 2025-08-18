import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCityWeather } from '@src/hooks/useCityWeather';
import { getCurrentWeather } from '@src/services/weatherService';

jest.mock('@src/services/weatherService');

describe('useCityWeather Integration', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false, // Disable retries for tests
        },
      },
    });
    getCurrentWeather.mockClear();
  });

  afterEach(() => {
    queryClient.clear();
  });

  const createWrapper = () => {
    return ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };

  test('should fetch current weather by city successfully', async () => {
    const mockWeatherData = { name: 'London', main: { temp: 15 } };
    getCurrentWeather.mockResolvedValue(mockWeatherData);

    const { result } = renderHook(() => useCityWeather(null, null, 'London'), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getCurrentWeather).toHaveBeenCalledTimes(1);
    expect(getCurrentWeather).toHaveBeenCalledWith('London', null, null);
    expect(result.current.data).toEqual(mockWeatherData);
    expect(result.current.error).toBeNull();
  });

  test('should fetch current weather by lat/lon successfully', async () => {
    const mockWeatherData = { name: 'New York', main: { temp: 20 } };
    getCurrentWeather.mockResolvedValue(mockWeatherData);

    const { result } = renderHook(() => useCityWeather(40.7128, -74.0060, null), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getCurrentWeather).toHaveBeenCalledTimes(1);
    expect(getCurrentWeather).toHaveBeenCalledWith(null, 40.7128, -74.0060);
    expect(result.current.data).toEqual(mockWeatherData);
    expect(result.current.error).toBeNull();
  });

  test('should handle error when fetching weather', async () => {
    const mockError = new Error('API Error');
    getCurrentWeather.mockRejectedValue(mockError);

    const { result } = renderHook(() => useCityWeather(null, null, 'InvalidCity'), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(getCurrentWeather).toHaveBeenCalledTimes(1);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toEqual(mockError);
  });

  test('should not fetch if no location data is provided', async () => {
    const { result } = renderHook(() => useCityWeather(null, null, null), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(false); // enabled should be false
    expect(getCurrentWeather).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
  });
});
