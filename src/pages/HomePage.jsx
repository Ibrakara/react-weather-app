import React, { useEffect, useMemo } from "react";
import SearchBar from "../containers/SearchBar";
import { useQuery } from "@tanstack/react-query";
import { getCurrentWeather } from "../services/weatherService.js";
import WeatherCard from "../components/WeatherCard.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { useWeeklyForecast } from "../hooks/useForecastList.js";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  setCurrentWeather,
  setForecastList,
} from "../store/slices/weatherSlice.js";
import { setSearchedLocation } from "../store/slices/locationSlice.js";
import { getErrorMessage } from "../services/helpers.js";
import styles from "../styles/HomePage.module.css";

function HomePage() {
  const dispatch = useDispatch();
  const { t: translate } = useTranslation();

  const userLatitude = useSelector(
    (state) => state.location.currentLocation?.latitude
  );
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
  const errorMessage = useMemo(
    () => getErrorMessage(cityError, forecastError),
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
    <div className={styles.homePage}>
      <SearchBar
        onSearch={(location) => dispatch(setSearchedLocation(location))}
        placeholder={translate("search placeholder")}
      />
      {isLoading && <p>{translate("loading")}</p>}
      {hasError && <ErrorMessage message={errorMessage} />}
      {isSuccess && (
        <WeatherCard forecastData={forecastData} weatherData={cityData} />
      )}
      {!cityIsLoading && !cityData && !cityError && (
        <p>{translate("No weather data available")}.</p>
      )}
    </div>
  );
}

export default HomePage;
