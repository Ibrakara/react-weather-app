import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWeeklyForecast } from '@src/hooks/useForecastList';
import { getThreeHourlyForecast } from '@src/services/weatherService';
import { getDailyForecast } from '@src/services/helpers';

jest.mock('@src/services/weatherService');
jest.mock('@src/services/helpers');

describe('useForecastList Integration', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false, // Disable retries for tests
        },
      },
    });
    getThreeHourlyForecast.mockClear();
    getDailyForecast.mockClear();
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

  test('should fetch and process forecast data successfully', async () => {
    const mockRawForecastData = { city: { name: 'London' }, list: [{ dt: 123, main: { temp: 20 }, weather: [{ icon: '01d' }] }] };
    const mockProcessedForecastData = [{ date: 'Mon', temp: 20, icon: '01d' }];

    getThreeHourlyForecast.mockResolvedValue(mockRawForecastData);
    getDailyForecast.mockReturnValue(mockProcessedForecastData);

    const { result } = renderHook(() => useWeeklyForecast(10, 20, 'London', true, ['key'], true), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getThreeHourlyForecast).toHaveBeenCalledTimes(1);
    expect(getThreeHourlyForecast).toHaveBeenCalledWith('London', 10, 20);
    expect(getDailyForecast).toHaveBeenCalledTimes(1);
    expect(getDailyForecast).toHaveBeenCalledWith(mockRawForecastData);
    expect(result.current.data).toEqual(mockProcessedForecastData);
    expect(result.current.error).toBeNull();
  });

  test('should fetch raw forecast data successfully when processData is false', async () => {
    const mockRawForecastData = { city: { name: 'London' }, list: [{ dt: 123, main: { temp: 20 }, weather: [{ icon: '01d' }] }] };

    getThreeHourlyForecast.mockResolvedValue(mockRawForecastData);

    const { result } = renderHook(() => useWeeklyForecast(10, 20, 'London', false, ['key'], true), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getThreeHourlyForecast).toHaveBeenCalledTimes(1);
    expect(getThreeHourlyForecast).toHaveBeenCalledWith('London', 10, 20);
    expect(getDailyForecast).not.toHaveBeenCalled(); // Should not call getDailyForecast
    expect(result.current.data).toEqual(mockRawForecastData);
    expect(result.current.error).toBeNull();
  });

  test('should handle error when fetching forecast', async () => {
    const mockError = new Error('Forecast API Error');
    getThreeHourlyForecast.mockRejectedValue(mockError);

    const { result } = renderHook(() => useWeeklyForecast(10, 20, 'London', true, ['key'], true), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(getThreeHourlyForecast).toHaveBeenCalledTimes(1);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toEqual(mockError);
  });

  test('should not fetch if enabled is false', async () => {
    const { result } = renderHook(() => useWeeklyForecast(10, 20, 'London', true, ['key'], false), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(false);
    expect(getThreeHourlyForecast).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
  });
});
