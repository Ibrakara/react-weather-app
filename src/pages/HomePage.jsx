import React, { useState, useEffect } from "react";
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
import { useWeatherAndForecast } from "../hooks/useWeatherAndForecast.js";
import toast from "react-hot-toast";

function HomePage() {
  const dispatch = useDispatch();
  const { t: translate } = useTranslation();
  const [searchText, setSearchText] = useState("");

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
    weatherData: searchedWeatherData,
    forecastData: searchedForecastData,
    isSuccess: searchedIsSuccess,
    error: searchedError,
  } = useWeatherAndForecast(searchedLocation, null, null);

  const {
    weatherData: currentLocationWeatherData,
    forecastData: currentLocationForecastData,
    isSuccess: currentLocationIsSuccess,
  } = useWeatherAndForecast(null, userLatitude, userLongitude);

  useEffect(() => {
    if (searchedError) {
      toast.error(translate("City not found"));
    }
  }, [searchedError, searchedLocation]);

  useEffect(() => {
    console.log("Searched Location:", searchedLocation);
    if (
      !searchedIsSuccess ||
      !searchedLocation ||
      !searchedWeatherData ||
      !searchedForecastData
    ) {
      return;
    }
    if (
      searchedLocations?.some(
        (location) => location.locationName === searchedLocation
      )
    ) {
      toast.error(translate("Location already exists"));
      return;
    }
    dispatch(
      addSearchedLocation({
        locationName: searchedLocation,
        cityData: searchedWeatherData,
        forecastData: searchedForecastData,
      })
    );
    toast.success(translate("Location added successfully"));
  }, [searchedLocation, searchedWeatherData, searchedForecastData, dispatch]);

  useEffect(() => {
    if (currentLocationIsSuccess) {
      dispatch(
        setCurrentLocation({
          locationName: "currentLocation",
          cityData: currentLocationWeatherData,
          forecastData: currentLocationForecastData,
        })
      );
    }
  }, [
    currentLocationIsSuccess,
    currentLocationWeatherData,
    currentLocationForecastData,
    dispatch,
  ]);

  useEffect(() => {
    return () => {
      dispatch(setSearchedLocation(null));
    };
  }, [dispatch]);

  return (
    <div className={styles.homePage}>
      <SearchBar
        value={searchText}
        onChange={setSearchText}
        onSearch={(location) => dispatch(setSearchedLocation(location))}
        placeholder={translate("search placeholder")}
      />
      {currentLocation && (
        <WeatherCard
          forecastData={currentLocation?.forecastData}
          weatherData={currentLocation?.cityData}
          isRemovable={false}
        />
      )}
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
