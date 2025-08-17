import React, { useMemo, useEffect } from "react";
import SearchBar from "../containers/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  setSearchedLocation,
  addSearchedLocation,
  setCurrentLocation,
} from "../store/slices/locationSlice.js";
import styles from "../styles/HomePage.module.css";
import WeatherCard from "../components/WeatherCard";
import { useWeeklyForecast } from "../hooks/useForecastList.js";
import { useCityWeather } from "../hooks/useCityWeather.js";
import toast from "react-hot-toast";

function HomePage() {
  const dispatch = useDispatch();
  const { t: translate } = useTranslation();

  const searchedLocations = useSelector(
    (state) => state.location.searchedLocations
  );
  const searchedLocation = useSelector(
    (state) => state.location.searchedLocation
  );
  const currentLocation = useSelector(
    (state) => state.location.currentLocation
  );
  const userLatitude = useSelector(
    (state) => state.location.geoLocation?.latitude
  );
  const userLongitude = useSelector(
    (state) => state.location.geoLocation?.longitude
  );

  const {
    data: cityData,
    error: cityError,
    isSuccess: cityIsSuccess,
  } = useCityWeather(null, null, searchedLocation, [
    "cityWeather",
    searchedLocation,
  ]);

  const { data: currentLocationData, isSuccess: currentLocationIsSuccess } =
    useCityWeather(userLatitude, userLongitude, null, [
      "currentLocationWeather",
      userLatitude,
      userLongitude,
    ]);

  const {
    data: forecastData,
    isSuccess: forecastIsSuccess,
    error: forecastError,
  } = useWeeklyForecast(
    cityData?.coord?.lat,
    cityData?.coord?.lon,
    searchedLocation,
    true,
    [
      "weeklyForecast",
      cityData?.coord?.lat,
      cityData?.coord?.lon,
      searchedLocation,
    ]
  );

  const {
    data: currentLocationForecastData,
    isSuccess: currentLocationForecastIsSuccess,
  } = useWeeklyForecast(
    currentLocationData?.coord?.lat,
    currentLocationData?.coord?.lon,
    null,
    true,
    [
      "weeklyForecast",
      currentLocationData?.coord?.lat,
      currentLocationData?.coord?.lon,
    ]
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
    if (hasError) {
      toast.error(translate("City not found"));
    }
  }, [hasError, searchedLocation]);

  useEffect(() => {
    if (!isSuccess || !searchedLocation || !cityData || !forecastData) {
      return;
    }
    if (
      searchedLocations?.some(
        (location) => location.locationName === searchedLocation
      )
    ) {
      console.log("Location already exists:", searchedLocation);
      return;
    }
    dispatch(
      addSearchedLocation({
        locationName: searchedLocation,
        cityData: cityData,
        forecastData: forecastData,
      })
    );
  }, [isSuccess, searchedLocation, cityData, forecastData]);

  useEffect(() => {
    if (currentLocationIsSuccess && currentLocationForecastIsSuccess) {
      dispatch(
        setCurrentLocation({
          locationName: "currentLocation",
          cityData: currentLocationData,
          forecastData: currentLocationForecastData,
        })
      );
    }
  }, [
    currentLocationIsSuccess,
    currentLocationData,
    currentLocationForecastIsSuccess,
    currentLocationForecastData,
  ]);

  return (
    <div className={styles.homePage}>
      <SearchBar
        onSearch={(location) => dispatch(setSearchedLocation(location))}
        placeholder={translate("search placeholder")}
      />
      <WeatherCard
        forecastData={currentLocation?.forecastData}
        weatherData={currentLocation?.cityData}
        isRemovable={false}
      />
      {searchedLocations?.map((location) => (
        <WeatherCard
          key={location.locationName}
          forecastData={location.forecastData}
          weatherData={location.cityData}
          isRemovable={true}
          searchedName={location.locationName}
        />
      ))}
    </div>
  );
}

export default HomePage;
