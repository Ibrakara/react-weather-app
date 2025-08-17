import React, { memo } from "react";
import WeatherIcon from "./WeatherIcon";
import DailyForecast from "./DailyForecast";
import { useTranslation } from "react-i18next";
import styles from "../styles/WeatherCard.module.css";
import { useDispatch } from "react-redux";
import { removeSearchedLocation } from "../store/slices/locationSlice";

const WeatherCard = ({
  weatherData,
  forecastData,
  isRemovable = true,
  searchedName,
}) => {
  const { t: translate } = useTranslation();
  const dispatch = useDispatch();
  if (!weatherData || !weatherData.main || !weatherData.weather) {
    return <p>No weather data to display.</p>;
  }

  const { name, main, weather } = weatherData;
  const { temp } = main;
  const { description, icon } = weather[0];

  const handleRemove = () => {
    dispatch(removeSearchedLocation(searchedName));
  };

  return (
    <div className={styles.card}>
      {isRemovable && (
        <div className={styles.closeButtonContainer}>
          <button className={styles.closeButton} onClick={handleRemove}>
            X
          </button>
        </div>
      )}
      <div>
        <h2 className={styles.cityName}>{name}</h2>
        <div className={styles.weatherInfo}>
          <WeatherIcon iconCode={icon} className={styles.icon} size={80} />
          <div className={styles.tempContainer}>
            <p className={styles.temperature}>{temp}°C</p>
            <p className={styles.description}>{translate(description)}</p>
          </div>
        </div>
      </div>
      <DailyForecast data={forecastData} locationName={name} />
    </div>
  );
};

export default memo(WeatherCard);
