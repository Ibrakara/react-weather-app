import React, { memo } from "react";
import WeatherIcon from "./WeatherIcon";
import styles from "../styles/ForecastCard.module.css";

function ForecastCard({ dateString, iconCode, temp, description }) {
  return (
    <div className={styles.card}>
      <p className={styles.dateTime}>{dateString}</p>
      <WeatherIcon iconCode={iconCode} size={40} className={styles.icon} />
      <div className={styles.temps}>
        <span className={styles.temp}>{temp}°C</span>
      </div>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
}

export default memo(ForecastCard);
