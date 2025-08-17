import { useCityWeather } from "./useCityWeather";
import { useWeeklyForecast } from "./useForecastList";

export function useWeatherAndForecast(locationName, lat, lon) {
  const {
    data: weatherData,
    isLoading: weatherIsLoading,
    error: weatherError,
    isSuccess: weatherIsSuccess,
  } = useCityWeather(lat, lon, locationName);

  const forecastLat = weatherData?.coord?.lat;
  const forecastLon = weatherData?.coord?.lon;
  const enabled = !!forecastLat && !!forecastLon;

  const {
    data: forecastData,
    isLoading: forecastIsLoading,
    error: forecastError,
    isSuccess: forecastIsSuccess,
  } = useWeeklyForecast(
    forecastLat,
    forecastLon,
    locationName,
    true,
    ["weeklyForecast", forecastLat, forecastLon, locationName],
    enabled
  );

  return {
    weatherData,
    forecastData,
    isLoading: weatherIsLoading || forecastIsLoading,
    error: weatherError || forecastError,
    isSuccess: weatherIsSuccess && forecastIsSuccess,
  };
}
