import { useQuery } from "@tanstack/react-query";
import { getThreeHourlyForecast } from "../services/weatherService.js";
import { getDailyForecast } from "../services/helpers.js";

export function useWeeklyForecast(
  lat,
  lon,
  locationName,
  processData = true,
  queryKey = ["weeklyForecast", lat, lon, locationName]
) {
  console.log(queryKey[0]);
  return useQuery({
    queryKey: queryKey,
    queryFn: () => getThreeHourlyForecast(locationName, lat, lon),
    staleTime: 1000 * 60 * 5,
    enabled: (!!lat && !!lon) || !!locationName,
    retry: false,
    select: processData ? getDailyForecast : undefined,
  });
}
