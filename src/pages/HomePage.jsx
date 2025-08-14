import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import { useQuery } from "@tanstack/react-query";
import {
  getCurrentWeather,
  getThreeHourlyForecast,
} from "../services/weatherService.js";
import WeatherCard from "../components/WeatherCard.jsx";
import { getDailyForecast } from "../services/helpers.js";

function HomePage() {
  const [locationName, setLocationName] = useState("");
  const handleSearch = (location) => {
    setLocationName(location);
  };
  const {
    isLoading: cityIsLoading,
    data: cityData,
    error: cityError,
    isSuccess: cityIsSuccess,
  } = useQuery({
    queryKey: ["cityWeather", locationName],
    queryFn: () => getCurrentWeather(locationName),
    staleTime: 1000 * 60 * 5,
    enabled: !!locationName,
    retry: false,
  });
  const {
    isLoading: forecastIsLoading,
    data: forecastData,
    error: forecastError,
  } = useQuery({
    queryKey: [
      "weeklyForecast",
      cityData?.coord?.lat,
      cityData?.coord?.lon,
      locationName,
    ],
    queryFn: () =>
      getThreeHourlyForecast(cityData?.coord?.lat, cityData?.coord?.lon),
    staleTime: 1000 * 60 * 5,
    enabled: !!cityData?.coord?.lat && !!cityData?.coord?.lon && cityIsSuccess,
    retry: false,
    select: (data) => getDailyForecast(data),
  });
  return (
    <>
      <SearchBar onSearch={handleSearch} />
      {cityIsLoading && <p>Loading...</p>}
      {cityError && <p>Error: {cityError.message}</p>}
      {cityData && <WeatherCard weatherData={cityData} />}
      {!cityIsLoading && !cityError && !cityData && (
        <p>No weather data available.</p>
      )}
    </>
  );
}

export default HomePage;
