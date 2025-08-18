import React, { memo } from "react";
import WeatherIcon from "./WeatherIcon";
import { WiHumidity, WiStrongWind } from "react-icons/wi";
import styles from "../styles/ForecastCard.module.css";

function ForecastCard({
  dateString,
  iconCode,
  temp,
  humidity,
  windSpeed,
  description,
}) {
  return (
    <div className={styles.card}>
      <p className={styles.dateTime}>{dateString}</p>
      <WeatherIcon iconCode={iconCode} size={40} className={styles.icon} />
      <div className={styles.temps}>
        <span className={styles.temp}>{temp}°C</span>
      </div>
      {humidity && <p className={styles.humidity}><WiHumidity /> Humidity: {humidity}%</p>}
      {windSpeed && <p className={styles.windSpeed}><WiStrongWind /> Wind: {windSpeed} m/s</p>}
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
}

export default memo(ForecastCard);
