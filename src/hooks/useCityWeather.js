import { useQuery } from "@tanstack/react-query";
import { getCurrentWeather } from "../services/weatherService";

export function useCityWeather(
  lat,
  lon,
  locationName,
  queryKey = ["currentWeather", lat, lon, locationName]
) {
  return useQuery({
    queryKey: queryKey,
    queryFn: () => getCurrentWeather(locationName, lat, lon),
    staleTime: 1000 * 60 * 5,
    enabled: (!!lat && !!lon) || !!locationName,
    retry: false,
  });
}
