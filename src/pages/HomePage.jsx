import React, { useEffect, useMemo } from "react";
import SearchBar from "../containers/SearchBar";
import { useQuery } from "@tanstack/react-query";
import { getCurrentWeather } from "../services/weatherService.js";
import WeatherCard from "../components/WeatherCard.jsx";
import { useWeeklyForecast } from "../hooks/useForecastList.js";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentWeather,
  setForecastList,
} from "../store/slices/weatherSlice.js";
import { setSearchedLocation } from "../store/slices/locationSlice.js";

function HomePage() {
  const dispatch = useDispatch();
  const userLatitude = useSelector((state) => {
    console.log(state.location.currentLocation?.latitude);
    return state.location.currentLocation?.latitude;
  });
  const userLongitude = useSelector(
    (state) => state.location.currentLocation?.longitude
  );
  const locationName = useSelector((state) => state.location.searchedLocation);

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
    error: forecastError,
  } = useWeeklyForecast(
    cityData?.coord?.lat,
    cityData?.coord?.lon,
    locationName
  );
  const isLoading = useMemo(
    () => cityIsLoading || forecastIsLoading,
    [cityIsLoading, forecastIsLoading]
  );
  const hasError = useMemo(
    () => !!(cityError || forecastError),
    [cityError, forecastError]
  );
  const isSuccess = useMemo(
    () => cityIsSuccess && forecastIsSuccess,
    [cityIsSuccess, forecastIsSuccess]
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
      <SearchBar
        onSearch={(location) => dispatch(setSearchedLocation(location))}
      />
      {isLoading && <p>Loading...</p>}
      {hasError && <p>Error:{` ${cityError.response.data.message}`}</p>}
      {isSuccess && (
        <WeatherCard forecastData={forecastData} weatherData={cityData} />
      )}
      {!cityIsLoading && !cityData && !cityError && (
        <p>No weather data available.</p>
      )}
    </>
  );
}

export default HomePage;
