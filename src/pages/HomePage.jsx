import React, { useState, useEffect } from "react";
import SearchBar from "../containers/SearchBar";
import { useQuery } from "@tanstack/react-query";
import { getCurrentWeather } from "../services/weatherService.js";
import WeatherCard from "../components/WeatherCard.jsx";
import { useWeeklyForecast } from "../hooks/useForecastList.js";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentWeather,
  setForecastList,
} from "../store/slices/wheaterSlice.js";

function HomePage() {
  const dispatch = useDispatch();
  const userLatitude = useSelector((state) => {
    console.log(state.location.currentLocation?.latitude);
    return state.location.currentLocation?.latitude;
  });
  const userLongitude = useSelector(
    (state) => state.location.currentLocation?.longitude
  );
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
    queryKey: ["cityWeather", locationName, userLatitude, userLongitude],
    queryFn: () =>
      locationName
        ? getCurrentWeather(locationName)
        : getCurrentWeather(null, userLatitude, userLongitude),
    staleTime: 1000 * 60 * 5,
    enabled: !!locationName || !!(userLatitude && userLongitude),
    retry: false,
  });
  const {
    isLoading: forecastIsLoading,
    data: forecastData,
    isSuccess: forecastIsSuccess,
  } = useWeeklyForecast(
    cityData?.coord?.lat,
    cityData?.coord?.lon,
    locationName
  );
  useEffect(() => {
    if (cityIsSuccess && cityData) {
      dispatch(setCurrentWeather(cityData));
    }
  }, [cityIsSuccess, cityData, dispatch]);
  useEffect(() => {
    if (forecastIsSuccess && forecastData) {
      dispatch(setForecastList(forecastData));
    }
  }, [forecastIsSuccess, forecastData, dispatch]);

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      {cityIsLoading || (forecastIsLoading && <p>Loading...</p>)}
      {cityError && <p>Error: {cityError.message}</p>}
      {cityIsSuccess && cityData && forecastIsSuccess && forecastData && (
        <WeatherCard forecastData={forecastData} weatherData={cityData} />
      )}
      {!cityIsLoading && !cityData && !cityError && (
        <p>No weather data available.</p>
      )}
    </>
  );
}

export default HomePage;
