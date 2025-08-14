import React from "react";
import WeatherIcon from "./WeatherIcon";
import styles from "../styles/WeatherCard.module.css";

const WeatherCard = ({ weatherData }) => {
  if (!weatherData || !weatherData.main || !weatherData.weather) {
    return <p>No weather data to display.</p>;
  }

  const { name, main, weather } = weatherData;
  const { temp } = main;
  const { description, icon } = weather[0];

  return (
    <div className={styles.card}>
      <h2 className={styles.cityName}>{name}</h2>
      <div className={styles.weatherInfo}>
        <WeatherIcon iconCode={icon} className={styles.icon} size={80} />
        <div className={styles.tempContainer}>
          <p className={styles.temperature}>{temp}°C</p>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
