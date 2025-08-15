import { useQuery } from "@tanstack/react-query";
import { getThreeHourlyForecast } from "../services/weatherService.js";
import { getDailyForecast } from "../services/helpers.js";

export function useWeeklyForecast(lat, lon, locationName, processData = true) {
  return useQuery({
    queryKey: ["weeklyForecast", lat, lon, locationName],
    queryFn: () => getThreeHourlyForecast(locationName, lat, lon),
    staleTime: 1000 * 60 * 5,
    enabled: (!!lat && !!lon) || !!locationName,
    retry: false,
    select: processData ? getDailyForecast : undefined,
  });
}
