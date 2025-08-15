import React from "react";
import WeatherIcon from "./WeatherIcon";
import DailyForecast from "./DailyForecast";
import { useTranslation } from "react-i18next";
import styles from "../styles/WeatherCard.module.css";

const WeatherCard = ({ weatherData, forecastData }) => {
  const { t: translate } = useTranslation();
  if (!weatherData || !weatherData.main || !weatherData.weather) {
    return <p>No weather data to display.</p>;
  }

  const { name, main, weather } = weatherData;
  const { temp } = main;
  const { description, icon } = weather[0];

  return (
    <div className={styles.card}>
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

export default WeatherCard;
