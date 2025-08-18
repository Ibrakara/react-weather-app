import axios from 'axios';
import { getCurrentWeather, getThreeHourlyForecast } from '@src/services/weatherService';

jest.mock('axios');

describe('weatherService Integration', () => {
  const mockApiKey = 'mock-api-key'; // In a real scenario, this would come from environment variables
  const mockBaseUrl = 'https://api.openweathermap.org/data/2.5';

  beforeAll(() => {
    // Set up environment variable for API key if weatherService uses it
    process.env.VITE_OPEN_WEATHER_API_KEY = mockApiKey;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrentWeather', () => {
    test('should fetch current weather by city successfully', async () => {
      const mockWeatherData = { data: { name: 'London', main: { temp: 15 } } };
      axios.get.mockResolvedValue(mockWeatherData);

      const city = 'London';
      const result = await getCurrentWeather(city);

      expect(axios.get).toHaveBeenCalledWith(`${mockBaseUrl}/weather`, {
        params: { q: city, units: 'metric', appid: mockApiKey },
      });
      expect(result).toEqual(mockWeatherData.data);
    });

    test('should fetch current weather by lat/lon successfully', async () => {
      const mockWeatherData = { data: { name: 'New York', main: { temp: 20 } } };
      axios.get.mockResolvedValue(mockWeatherData);

      const lat = 40.7128;
      const lon = -74.0060;
      const result = await getCurrentWeather(null, lat, lon, 'imperial');

      expect(axios.get).toHaveBeenCalledWith(`${mockBaseUrl}/weather`, {
        params: { lat, lon, units: 'imperial', appid: mockApiKey },
      });
      expect(result).toEqual(mockWeatherData.data);
    });

    test('should handle API error for getCurrentWeather', async () => {
      const errorMessage = 'Network Error';
      axios.get.mockRejectedValue(new Error(errorMessage));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await expect(getCurrentWeather('InvalidCity')).rejects.toThrow(errorMessage);
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    test('should return null if no city or lat/lon is provided for getCurrentWeather', async () => {
      const result = await getCurrentWeather(null, null, null);
      expect(result).toBeNull();
      expect(axios.get).not.toHaveBeenCalled();
    });
  });

  describe('getThreeHourlyForecast', () => {
    test('should fetch 3-hourly forecast by city successfully', async () => {
      const mockForecastData = { data: { city: { name: 'London' }, list: [] } };
      axios.get.mockResolvedValue(mockForecastData);

      const city = 'London';
      const result = await getThreeHourlyForecast(city);

      expect(axios.get).toHaveBeenCalledWith(`${mockBaseUrl}/forecast`, {
        params: { q: city, units: 'metric', appid: mockApiKey, exclude: 'minutely,hourly' },
      });
      expect(result).toEqual(mockForecastData.data);
    });

    test('should fetch 3-hourly forecast by lat/lon successfully', async () => {
      const mockForecastData = { data: { city: { name: 'New York' }, list: [] } };
      axios.get.mockResolvedValue(mockForecastData);

      const lat = 40.7128;
      const lon = -74.0060;
      const result = await getThreeHourlyForecast(null, lat, lon, 'imperial');

      expect(axios.get).toHaveBeenCalledWith(`${mockBaseUrl}/forecast`, {
        params: { lat, lon, units: 'imperial', appid: mockApiKey, exclude: 'minutely,hourly' },
      });
      expect(result).toEqual(mockForecastData.data);
    });

    test('should handle API error for getThreeHourlyForecast', async () => {
      const errorMessage = 'Request failed';
      axios.get.mockRejectedValue(new Error(errorMessage));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await expect(getThreeHourlyForecast('InvalidCity')).rejects.toThrow(errorMessage);
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    test('should return null if no city or lat/lon is provided for getThreeHourlyForecast', async () => {
      const result = await getThreeHourlyForecast(null, null, null);
      expect(result).toBeNull();
      expect(axios.get).not.toHaveBeenCalled();
    });
  });
});
