import { useQuery } from "@tanstack/react-query";
import { getThreeHourlyForecast } from "../services/weatherService.js";
import { getDailyForecast } from "../services/helpers.js";

export function useWeeklyForecast(lat, lon, locationName) {
  return useQuery({
    queryKey: ["weeklyForecast", lat, lon, locationName],
    queryFn: () => getThreeHourlyForecast(lat, lon),
    staleTime: 1000 * 60 * 5,
    enabled: !!lat && !!lon,
    retry: false,
    select: getDailyForecast,
  });
}
